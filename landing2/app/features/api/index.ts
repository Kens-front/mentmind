


interface ICreateMetrikDto {
    sessionId?: string
    event: string
}

interface IMetrika {
    sessionId?: string
    id: string
    event: string
    pageView: number
    formView: number
}



interface IMetrikaApi {
    create: (dto: ICreateMetrikDto) => Promise<IMetrika>
}


export const metrikaApi: IMetrikaApi = {
    async create(dto) {
        const response = await fetch('/api/metrika', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dto)
        })

        const metrikData = await response.json() as IMetrika

        return metrikData
    }
}