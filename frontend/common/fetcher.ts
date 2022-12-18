// @ts-ignore
const fetcher = async (...args) => {
  // @ts-ignore
  const res = await fetch(...args);

  if (!res.ok) {
    throw new Error(`An error occurred while fetching the data: ${res.status} ${await res.text()}`)
  }

  return res.json()
};
export default fetcher;