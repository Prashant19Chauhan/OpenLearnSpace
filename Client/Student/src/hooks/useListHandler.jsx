import {useQuery} from "@tanstack/react-query";
import { getList } from "../Api/Auth";
const useListHandler = () => {

    const {data, refetch} = useQuery({
        queryKey: ['users'],
        queryFn: getList,
        enabled: false
    })

    const getListCall = () => {
        refetch();
    }
    return [data, getListCall]
}

export default useListHandler;