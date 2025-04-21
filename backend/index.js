import { PrismaClient } from "@prisma/client"
import express from "express"

const App = express()
const prisma = new PrismaClient()

App.use(express.json())

App.get('/', (request, response) => {

    const getVacancies = async () => {
        const vacancies = await prisma.vacancy.findMany()
        console.log(vacancies)
    }

    getVacancies()

    response.status(200).end()
})

App.post('/fill-vacancy', async (request, response) => {

    const { user_name, user_CPF, user_vehicle, vehicle_color, vacancy_id } = request.body

    if (!user_name || !user_CPF || !user_vehicle || !vehicle_color) {
        return response.json({ message: "Todos os campos são obrigatorios!" }).status(400)
    }

    if (!vacancy_id || vacancy_id > 30 || vacancy_id < 1) {
        return response.json({ message: "Id da vaga é obrigatorio e deve ser entre 1 e 30!" }).status(400)
    }

    try {

        const vacancy = await prisma.vacancy.findUnique({
            where: {
                vacancy_id: vacancy_id
            }
        })

        if (!vacancy) {
            return response.json({ message: "Id da vaga é obrigatorio e deve ser entre 1 e 30!" }).status(400)
        }

        if (!vacancy.vacancy_available) {
            return response.json({ message: "Vaga escolhida já se encontra ocupada!" }).status(400)
        }

        const verifyUserHasVacancy = await prisma.vacancy.findFirst({
            where: {
                user: {
                    user_CPF: user_CPF
                }
            },
            include: {
                user: true
            }
        })

        if (verifyUserHasVacancy) {
            return response.json({ message: "Você ja preencheu uma vaga!" }).status(400)
        }

        const createUser = await prisma.user.create({
            data: {
                user_name: user_name,
                user_CPF: user_CPF,
                user_vehicle: user_vehicle,
                vehicle_color: vehicle_color,
                vacancy: {
                    connect: { vacancy_id }
                }
            },
            select: {
                user_id: true,
                user_name: true
            }
        })

        await prisma.vacancy.update({
            where: {
                vacancy_id: vacancy_id
            },
            data: {
                vacancy_available: false
            }
        })

        return response.status(201).json({ message: "Vaga preenchida com sucesso!", user: createUser });

    } catch (error) {
        console.error(error);
        return response.status(500).json({ message: "Erro ao preencher a vaga." });
    }
})


App.post('/release-vacancy', async (request, response) => {

    const { user_CPF } = request.body

    if (!user_CPF) {
        return response.json({ message: "Todos os campos são obrigatorios!" }).status(400)
    }

    try {
        
        const vacancyByUserCPF = await prisma.vacancy.findUnique({
            where: {
                user: {
                    user_CPF: user_CPF
                }
            },
            include: {
                user: true
            }
        })

        if(!vacancyByUserCPF){
            return response.json({message: "Não há nenhuma vaga de estacionamento preenchida por esse CPF!"}).status(400)
        }

        if (vacancy.vacancy_available) {
            return response.json({ message: "Vaga escolhida já se encontra disponivel!" }).status(400)
        }

        await prisma.vacancy.update({
            where: {
                vacancy_id: vacancyIdUser
            },
            data: {
                vacancy_available: true
            }
        })

        return response.status(201).json({ message: "Vaga disponivel com sucesso!" });
    }

    catch (error) {
        console.error(error);
        return response.status(500).json({ message: "Erro ao liberar a vaga." });
    }
})

App.listen("3000")


