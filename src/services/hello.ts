import axios from 'axios';

interface Hello {
    hello: string
}

export function helloService()
{
    // @todo asyncHandler
    const fetch = async (): Promise<string> => {
        const response = await axios.get<Hello>(`/api/hello`);
        console.log('loadHello', response);
        return response.data.hello;
    }

    return {
        fetch
    }
}