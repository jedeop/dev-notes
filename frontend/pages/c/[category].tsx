import { useRouter } from 'next/router'
import MainView from '../../components/MainView'
import { DEFAULT_TITLE, Title } from '../../common/title';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';

export const getServerSideProps: GetServerSideProps<{title: Title}> = async ({ params }) => {
  const res = await fetch(`https://note.jedeop.dev/api/category/${params?.category || "default"}`)
  const data: Title = await res.json()
 
  return { props: { title: data } }
}

export default function CategoryView({ title }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const category = router.query.category as string;
  return (
    <MainView category={category} title={title || DEFAULT_TITLE} />
  )
}
