import { useRouter } from 'next/router'
import MainView from '../../components/MainView'
import { DEFAULT_TITLE, Title } from '../../common/title';
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next';

export const getStaticProps: GetStaticProps<{title: Title}> = async ({ params }) => {
  const res = await fetch(`${process.env.API_BASE_URI}/api/category/${params?.category || "default"}`)
  const data: Title = await res.json()
 
  return { props: { title: data } }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const res = await fetch(`${process.env.API_BASE_URI}/api/categories`)
  const data: string[] = await res.json()
  const paths = data.map(category => ({
    params: { category },
  }))
  return {
    paths,
    fallback: false,
  }
}

export default function CategoryView({ title }: InferGetStaticPropsType<typeof getStaticProps>) {
  const router = useRouter();
  const category = router.query.category as string;
  return (
    <MainView category={category} title={title || DEFAULT_TITLE} />
  )
}
