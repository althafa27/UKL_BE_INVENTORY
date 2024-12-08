import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getAllPeminjaman = async (req, res) => {
  try {
    const result = await prisma.peminjaman.findMany();
    const formattedData = result.map((record) => {
      const formattedBorrowDate = new Date(record.borrow_date)
        .toISOString()
        .split("T")[0];
      const formattedReturnDate = new Date(record.return_date)
        .toISOString()
        .split("T")[0];
      return {
        ...record,
        borrow_date: formattedBorrowDate,
        return_date: formattedReturnDate,
      };
    });

    res.json({
      success: true,
      data: formattedData,
    });
  } catch (error) {
    console.log(error);
    res.json({
      msg: error,
    });
  }
};
export const getPeminjamanById = async (req, res) => {
  try {
    const result = await prisma.peminjaman.findMany({
      where: {
        pinjamID: Number(req.params.id),
      },
    });
    const formattedData = result.map((record) => {
      const formattedBorrowDate = new Date(record.borrow_date)
        .toISOString()
        .split("T")[0];
      const formattedReturnDate = new Date(record.return_date)
        .toISOString()
        .split("T")[0];
      return {
        ...record,
        borrow_date: formattedBorrowDate,
        return_date: formattedReturnDate,
      };
    });
    if (formattedData) {
      res.json({
        success: true,
        data: formattedData,
      });
    } else {
      res.status(401).json({
        success: false,
        message: "data not found",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: error,
    });
  }
};

export const addPeminjaman = async (req, res) => {
  const { id_user, item_id, borrow_date, return_date, qty } = req.body;

  const formattedBorrowDate = new Date(borrow_date).toISOString(); //merubah format tanggal
  const formattedReturnDate = new Date(return_date).toISOString();

  const [getUserId, getBarangId] = await Promise.all([
    prisma.user.findUnique({ where: { userID: Number(id_user) } }),
    prisma.inventory.findUnique({ where: { id: Number(item_id) } }),
  ]);

  if (getUserId && getBarangId) {
    try {
      const result = await prisma.peminjaman.create({
        data: {
          user: {
            connect: {
              userID: Number(id_user),
            },
          },
          item: {
            connect: {
              id: Number(item_id),
            },
          },
          qty: qty,
          borrow_date: formattedBorrowDate,
          return_date: formattedReturnDate,
        },
      });
      if (result) {
        const item = await prisma.inventory.findUnique({
          where: { id: Number(item_id) },
        });

        if (!item) {
          throw new Error(
            `barang dengan id_barang ${id_barang} tidak ditemukan`
          );
        } else if (qty > item.quantity) {
          return res.status(400).json({
            success: false,
            message: `Barang yang Anda pinjam melebihi stok yang tersedia`,
          });
        } else {
          const minQty = item.quantity - qty;
          const result = await prisma.inventory.update({
            where: {
              id: Number(item_id),
            },
            data: {
              quantity: minQty,
            },
          });
        }
      }
      res.status(201).json({
        success: true,
        message: "Peminjaman Berhasil Dicatat",
        data: {
          borrow_id: result.pinjamID,
          id_user: result.userID,
          item_id: result.itemID,
          qty: result.qty,
          borrow_date: result.borrow_date.toISOString().split("T")[0], // Format tanggal (YYYY-MM-DD)
          return_date: result.return_date.toISOString().split("T")[0], // Format tanggal (YYYY-MM-DD)
          status: result.status,
        },
      });
    } catch (error) {
      console.log(error);
      res.json({
        msg: error,
      });
    }
  } else {
    res.json({ msg: "user dan barang belum ada" });
  }
};

export const pengembalianBarang = async (req, res) => {
  const { borrow_id, return_date } = req.body;

  const formattedReturnDate = new Date(return_date).toISOString();

  const cekBorrow = await prisma.peminjaman.findUnique({
    where: { pinjamID: Number(borrow_id) },
  });

  if (cekBorrow.status == "dipinjam") {
    try {
      const result = await prisma.peminjaman.update({
        where: {
          pinjamID: borrow_id,
        },
        data: {
          return_date: formattedReturnDate,
          status: "kembali",
        },
      });
      if (result) {
        const item = await prisma.inventory.findUnique({
          where: { id: Number(cekBorrow.pinjamID) },
        });

        if (!item) {
          throw new Error(
            `barang dengan id_barang tidak ditemukan`
          );
        } else {
          const restoreQty = cekBorrow.qty + item.quantity;
          const result = await prisma.inventory.update({
            where: {
              id: Number(cekBorrow.pinjamID),
            },
            data: {
              quantity: restoreQty,
            },
          });
        }
      }
      res.status(201).json({
        success: true,
        message: "Pengembalian Berhasil Dicatat",
        data: {
          borrow_id: result.pinjamID,
          id_user: result.userID,
          item_id: result.itemID,
          actual_return_date: result.return_date.toISOString().split("T")[0], // Format tanggal (YYYY-MM-DD)
          status: result.status,
        },
      });
    } catch (error) {
      console.log(error);
      res.json({
        msg: error.message,
      });
    }
  } else {
    res.json({ msg: "user dan barang belum ada" });
  }
};

export const usageReport = async (req, res) => {
  const { start_date, end_date, category, location, group_by } = req.body;

  const formattedStartDate = new Date(start_date).toISOString();
  const formattedEndDate = new Date(end_date).toISOString();

  try {
    // Filter barang berdasarkan kategori dan lokasi
    const items = await prisma.inventory.findMany({
      where: {
        AND: [
          { category: { contains: category || "" } },
          { location: { contains: location || "" } },
        ],
      },
    });

    if (items.length === 0) {
      return res.status(404).json({
        status: "fail",
        message: "No items found for the given filters.",
      });
    }

    // Ambil peminjaman berdasarkan rentang tanggal
    const borrowRecords = await prisma.peminjaman.findMany({
      where: {
        borrow_date: { gte: formattedStartDate },
        return_date: { lte: formattedEndDate },
      },
    });

    if (group_by !== 'category' && group_by !== 'location') {
      return res.status(400).json({
        status: "fail",
        message: "Invalid group_by value. Please use 'category' or 'location'.",
      });
    }

    // Kelompokkan data berdasarkan kategori atau lokasi
    const analysis = items.reduce((acc, item) => {
      const relevantBorrows = borrowRecords.filter(
        (record) => record.id_barang === item.id_barang
      );

      const totalBorrowed = relevantBorrows.reduce(
        (sum, record) => sum + record.qty,
        0
      );

      const totalReturned = relevantBorrows.reduce(
        (sum, record) => (record.status === "kembali" ? sum + record.qty : sum),
        0
      );

      const groupKey = group_by === 'category' ? item.category : item.location;

      // Cek apakah grup sudah ada di akumulator
      if (!acc[groupKey]) {
        acc[groupKey] = {
          group: groupKey,
          total_borrowed: 0,
          total_returned: 0,
          items_in_use: 0,
        };
      }

      // Tambahkan total borrow dan return ke grup yang sesuai
      acc[groupKey].total_borrowed += totalBorrowed;
      acc[groupKey].total_returned += totalReturned;
      acc[groupKey].items_in_use += totalBorrowed - totalReturned;

      return acc;
    }, {});

    // Ubah objek akumulator menjadi array
    const analysisArray = Object.values(analysis);

    // Respons dalam format yang diminta
    res.status(200).json({
      status: "success",
      data: {
        analysis_period: {
          start_date: start_date,
          end_date: end_date,
        },
        usage_analysis: analysisArray,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "An error occurred while processing the usage report.",
      error: error.message,
    });
  }
};