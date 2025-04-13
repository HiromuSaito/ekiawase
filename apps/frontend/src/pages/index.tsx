import DefaultLayout from "@/layouts/default";
import { Button, ButtonGroup } from "@heroui/button";

export default function IndexPage() {
  const API_URL = import.meta.env.VITE_API_URL;

  const callApi = async () => {
    try {
      console.log('APIURL=', API_URL)
      const response = await fetch(`${API_URL}/suggest-midpoint`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors'
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const result = await response.json();
      console.log(result)
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <Button color="primary">
          検索
        </Button>
      </section>
    </DefaultLayout>
  );
}
