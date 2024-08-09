import {NavBar} from "@/components/NavBar";

async function fetchData() {
    const response = await fetch("https://nay-backend.vercel.app/api/categories");
    return await response.json()
}
export default async function AsyncNavBar() {


    return <NavBar categories={await fetchData()}/>;
}
