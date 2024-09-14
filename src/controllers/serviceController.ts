import { toZonedTime } from "date-fns-tz";
import { z } from "zod";
import { isSameDay, isSameHour } from "date-fns";
import moment from "moment-timezone";
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { sumHour } from "../utils/sumHour";

const prisma = new PrismaClient();

export const createNewService = async (req: Request, res: Response) => {
  const bodySchema = z.object({
    price: z.number(),
    pet_id: z.string(),
    selected_date: z.coerce.date(),
    selected_time: z.object({
      available: z.boolean(),
      hour: z.string(),
    }),
    duration: z.number()
  });

  const { price, pet_id, selected_date, selected_time, duration } = bodySchema.parse(req.body)

  const user_id = req.user.id
  
  try { 
    await prisma.services.create({
        data: { 
            price,
            pet_id,
            user_id,
            selected_date,
            selected_time: selected_time.hour,
            end_time: sumHour(selected_time.hour, duration)
        }
    })

    return res.status(201).json()
  } catch (err){ 
    return res.status(500).json()
  }
};

interface AvailableTime {
  hour: string; // ou 'Date' se 'hour' for um objeto Date
  available: boolean;
}

export const getFreeTimesServices = async (req: Request, res: Response) => {
  const paramsSchema = z.object({
    date: z.string(),
  });

  const { date } = paramsSchema.parse(req.params);

  const parsedDate = new Date(Number(date));
  const today = toZonedTime(new Date(), "America/Sao_Paulo");

  try {
    const work_times = await prisma.agenda.findUnique({
      where: {
        id: 1,
      },
    });

    if (!work_times) {
      return res.status(500);
    }

    const servicesForTheDate = await prisma.services.findMany({
      where: {
        selected_date: {
          gte: new Date(new Date(parsedDate.toISOString()).setHours(0)),
          lt: new Date(new Date(parsedDate.toISOString()).setHours(23)),
        },
      },
    });

    const availableTimes = (work_times?.weekly_hours as any)[
      parsedDate.getDay()
    ].hours
      .map(
        ({
          start_hour,
          end_hour,
        }: {
          start_hour: string;
          end_hour: string;
        }) => {
          const parsedStartHour = Number(start_hour.slice(0, 2));
          const parsedStartMinute = Number(start_hour.slice(3, 5));
          const parsedEndHour = Number(end_hour.slice(0, 2));
          const parsedEndMinute = Number(end_hour.slice(3, 5));
          const serviceDuration = work_times.service_duration * 60; // converte para minutos

          const startTotalMinutes = parsedStartHour * 60 + parsedStartMinute;
          const endTotalMinutes = parsedEndHour * 60 + parsedEndMinute;

          const servicesTimes = servicesForTheDate.map((service) => {
            const [endHour, endMinute] = service.end_time
              .split(":")
              .map(Number);
            const serviceEnd = moment
              .tz(service.selected_date, "America/Sao_Paulo")
              .set({ hour: endHour, minute: endMinute })
              .toDate();

            const [startHour, startMinute] = service.selected_time
              .split(":")
              .map(Number);
            const serviceStart = moment
              .tz(service.selected_date, "America/Sao_Paulo")
              .set({ hour: startHour, minute: startMinute })
              .toDate();

            return {
              end: serviceEnd,
              start: serviceStart,
            };
          }) as Array<{ end: Date; start: Date; owner_id: string }>;

          const slots = [];
          for (
            let minutes = startTotalMinutes;
            minutes < endTotalMinutes;
            minutes += serviceDuration
          ) {
            const start = moment
              .tz(date, "America/Sao_Paulo")
              .startOf("day")
              .add(minutes, "minutes")
              .toDate();
            const end = moment(start).add(serviceDuration, "minutes").toDate();

            const isAfterNow = start.getTime() > today.getTime();
            const isToday = isSameDay(new Date(date), today);

            const hour = `${start
              .getHours()
              .toString()
              .padStart(2, "0")}:${start
              .getMinutes()
              .toString()
              .padStart(2, "0")}`;

            const servicessInTheSameTime = servicesTimes.filter((service) => {
              return start <= service.end && end >= service.start;
            });

            const isAlreadyBooked = servicesTimes.some((service) => {
              return isSameHour(start, service.start);
            });

            const isFull = servicessInTheSameTime.length >= 1;

            const isNotAvailable = isAlreadyBooked && isFull;

            const available = isToday
              ? isAfterNow && !isNotAvailable
              : !isNotAvailable;

            slots.push({
              available,
              hour,
            });
          }

          return slots;
        }
      )
      .flat();

    const uniqueAvailableTimes = Object.values(
      availableTimes.reduce((acc: any, current: any) => {
        // Se o horário estiver duplicado, remove o que não está disponível
        if (acc[current.hour]) {
          if (current.available) {
            acc[current.hour] = current;
          }
        } else {
          acc[current.hour] = current;
        }
        return acc;
      }, {} as { [key: string]: AvailableTime })
    );

    return res.status(200).json(uniqueAvailableTimes);
  } catch (err) {
    return res.status(500).json();
  }
};
