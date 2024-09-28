import Dashboard from "../components/Dashboard";
import {getDictionary} from "./dictionaries";
export default async function Home({params}) {
    const t = await getDictionary(await params.lang);
    return (
        <Dashboard t={await t}/>
    );

}
