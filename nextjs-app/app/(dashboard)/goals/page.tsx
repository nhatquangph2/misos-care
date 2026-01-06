import { redirect } from 'next/navigation'

// Redirect /goals to /my-path (Goals is now a tab within My Path)
export default function GoalsRedirect() {
  redirect('/my-path')
}
