import { v4 as uuid} from 'uuid'

const DEFAULT_WEEKLY_HOURS = [
    {
      id: uuid(),
      name: 'DOM',
      available: false,
      hours: [{ id: uuid(), start_hour: null, end_hour: null }]
    },
    {
      id: uuid(),
      name: 'SEG',
      available: true,
      hours: [{ id: uuid(), start_hour: '09:00', end_hour: '17:00' }]
    },
    {
      id: uuid(),
      name: 'TER',
      available: true,
      hours: [{ id: uuid(), start_hour: '09:00', end_hour: '17:00' }]
    },
    {
      id: uuid(),
      name: 'QUA',
      available: true,
      hours: [{ id: uuid(), start_hour: '09:00', end_hour: '17:00' }]
    },
    {
      id: uuid(),
      name: 'QUI',
      available: true,
      hours: [{ id: uuid(), start_hour: '09:00', end_hour: '17:00' }]
    },
    {
      id: uuid(),
      name: 'SEX',
      available: true,
      hours: [{ id: uuid(), start_hour: '09:00', end_hour: '17:00' }]
    },
    {
      id: uuid(),
      name: 'SAB',
      available: false,
      hours: [{ id: uuid(), start_hour: null, end_hour: null }]
    }
  ]

export const defaultAgenda = { 
    service_duration: 1,
    weekly_hours: DEFAULT_WEEKLY_HOURS
}
