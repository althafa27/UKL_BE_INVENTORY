import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient()

export const addInventory = async (req,res) => {
    const{name, category, location, quantity} = req.body

    try {
        const data = await prisma.inventory.create({
            data:{
                name: name,
                category: category,
                location: location,
                quantity: quantity
            }
        })
        res.status(200).json({
            status: 'success',
            message: 'Barang berhasil ditambahkan',
            data
        })
    } catch (error) {
        res.status(400).json({
            status: 'false',
            message: 'Barang gagal ditambahkan',
            error
        })
    }
}

export const updateInventory = async (req,res) => {
    const{name, category, location, quantity} = req.body

    try {
        const data = await prisma.inventory.update({
            where:{
                id: Number(req.params.id)
            },
            data:{
                name: name,
                category: category,
                location: location,
                quantity: quantity
            }
        })
        res.status(200).json({
            status: 'success',
            message: 'Data barang berhasil diubah',
            data
        })
    } catch (error) {
        if (error) {
            return res.status(404).json({
                status: false,
                message: 'Data barang tidak ditemukan'
            })
        }
        res.status(500).json({
            status: 'false',
            message: 'Data barang gagal diubah',
            error
        })
    }
}

export const getInventoryById = async (req, res) => {
    try {
        const result = await prisma.inventory.findUnique({
            where:{
                id: Number(req.params.id)
            }
        })
        if(result){
            res.status(200).json({
                status: 'success',
                data: result
            })
        } else {
            res.status(404).json({
                status: false,
                message: 'Data barang tidak ditemukan'
            })
        }
    } catch (error) {
        res.status(500).json({
            status: 'false',
            message: error
        })
    }
}

export const deleteInventory = async (req,res) => {
    try {
        const result = await prisma.inventory.delete({
            where:{
                id: Number(req.params.id)
            },
        })
        res.status(200).json({
            status: 'success',
            message: 'Barang berhasil dihapus'
        })
    } catch (error) {
        if(error){
            return res.status(404).json({
                status: false,
                message: 'Data barang tidak ditemukan'
            })
        }
        res.status(400).json({
            status:'false',
            message: error
        })
    }
}

export const getAllInventory = async (req,res) => {
    try {
        const result = await prisma.inventory.findMany()
        res.status(200).json(result)
    } catch (error) {
        res.status(400).json(error)
    }
}