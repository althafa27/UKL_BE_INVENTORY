import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient()
import md5 from 'md5'

export const getAllUser = async(req,res) => {
    try {
        const result = await prisma.user.findMany()
        res.status(200).json(result)
    } catch (error) {
        res.status(400).json({msg: error.message})
    }
}

export const getUserById = async(req,res) => {
    try {
        const result = await prisma.user.findUnique({
            where:{
                userID: Number(req.params.id)
            }
        })
        res.status(200).json(result)
    } catch (error) {
        res.status(400).json({msg: error.message})
    }
}

export const addUser = async(req,res) => {
    
    const {Nama, Username, Password, Role} = req.body
    console.log(Nama);
    
    try {
        const result = await prisma.user.create({
            data:{
                nama: Nama,
                username: Username,
                password: md5(Password),
                role: Role
            }
        })
        res.status(200).json(result)
    } catch (error) {
        res.status(500).json({msg: error.message})
        console.log(error.message)
    }
}

export const updateUser = async(req,res) => {
    const{Nama, Username, Password, Role} = req.body
    try {
        const result = await prisma.user.update({
            where:{
                userID : Number(req.params.id)
            },
            data:{
                nama: Nama,
                username: Username,
                password: md5(Password),
                role: Role
            }
        })
        res.status(200).json(result)
    } catch (error) {
        res.status(404).json({msg: error.message})
    }
}

export const deleteUser = async(req,res) => {
    try {
        const result = await prisma.user.delete({
            where:{
                userID: Number(req.params.id)
            },

        })
        res.status(200).json(result)
    } catch (error) {
        res.status(500).json({msg: error.message})
    }
}