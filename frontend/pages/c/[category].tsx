import { useRouter } from 'next/router'
import MainView from '../../components/MainView'

export default function CategoryView() {
  const router = useRouter();
  return (
    <MainView category={router.query.category as string | undefined} />
  )
}
