import axios, { AxiosError, AxiosResponse } from "axios";
import { Err, Ok, Result } from "@hqoss/monads";

export class Http {
    public static getContent(url: string):  Promise<Result<string, AxiosError>> {
        return axios
        .get(url)
        .then(
            (response: AxiosResponse) => Ok(response.data)
        )
        .catch(
            (err: AxiosError) => Err(err)
        );
    }
}