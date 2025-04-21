import { PrismaClient } from "@prisma/client"
import express from "express"

const App = express()
const prisma = new PrismaClient()

App.use(express.json())

// Buscar todas as vagas
App.get('/', async (request, response) => {
    try {
        const vacancies = await prisma.vacancy.findMany()
        console.log(vacancies)
        return response.status(200).json(vacancies)
    } catch (error) {
        console.error(error)
        return response.status(500).json({ message: "Erro ao buscar vagas." })
    }
})

// Preencher uma vaga
App.post('/fill-vacancy', async (request, response) => {
    const { user_name, user_CPF, user_vehicle, vehicle_color, vacancy_id } = request.body

    if (!user_name || !user_CPF || !user_vehicle || !vehicle_color) {
        return response.status(400).json({ message: "Todos os campos são obrigatórios!" })
    }

    if (!vacancy_id || vacancy_id > 30 || vacancy_id < 1) {
        return response.status(400).json({ message: "Id da vaga é obrigatório e deve ser entre 1 e 30!" })
    }

    try {
        const vacancy = await prisma.vacancy.findUnique({
            where: { vacancy_id: vacancy_id }
        })

        if (!vacancy) {
            return response.status(400).json({ message: "Id da vaga inválido!" })
        }

        if (!vacancy.vacancy_available) {
            return response.status(400).json({ message: "Vaga escolhida já se encontra ocupada!" })
        }

        const verifyUserHasVacancy = await prisma.vacancy.findFirst({
            where: {
                user: {
                    user_CPF: user_CPF
                }
            },
            include: { user: true }
        })

        if (verifyUserHasVacancy) {
            return response.status(400).json({ message: "Você já preencheu uma vaga!" })
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
            where: { vacancy_id: vacancy_id },
            data: { vacancy_available: false }
        })

        return response.status(201).json({ message: "Vaga preenchida com sucesso!", user: createUser })

    } catch (error) {
        console.error(error)
        return response.status(500).json({ message: "Erro ao preencher a vaga." })
    }
})

// Liberar uma vaga
App.post('/release-vacancy', async (request, response) => {
    const { user_CPF } = request.body

    if (!user_CPF) {
        return response.status(400).json({ message: "Todos os campos são obrigatórios!" })
    }

    try {
        const vacancyByUserCPF = await prisma.vacancy.findFirst({
            where: {
                user: {
                    user_CPF: user_CPF
                }
            },
            include: { user: true }
        })

        if (!vacancyByUserCPF) {
            return response.status(400).json({ message: "Não há nenhuma vaga preenchida por esse CPF!" })
        }

        if (vacancyByUserCPF.vacancy_available) {
            return response.status(400).json({ message: "A vaga já se encontra disponível!" })
        }

        await prisma.vacancy.update({
            where: { vacancy_id: vacancyByUserCPF.vacancy_id },
            data: { vacancy_available: true }
        })

        return response.status(201).json({ message: "Vaga liberada com sucesso!" })

    } catch (error) {
        console.error(error)
        return response.status(500).json({ message: "Erro ao liberar a vaga." })
    }
})

App.listen(3000, () => {
    console.log("Servidor rodando na porta 3000 🚗💨")
})
