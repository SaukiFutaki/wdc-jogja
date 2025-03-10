/* eslint-disable @typescript-eslint/no-unused-vars */
import { getUserNotifications } from '@/lib/actions/notification'
import { DataTableNotif } from './_components/data-notif'
import DashSection from './section-dash'

export default async function Page() {
  const data = await getUserNotifications()

  return (
   <div>
    <DashSection />
  
   </div>
  )
}
