const express = require("express");
const router = express.Router();
const Book = require("../models/book.model");

//MIDDLEWARE
const getBook = async (req, res, next) => {
	let book;
	const { id } = req.params;

	if (!id.match(/^[0-9a-fA-F]{24}$/)) {
		return res.status(404).json({ message: "El libro no fue encontrado" });
	}

	try {
		book = await Book.findById(id);
		if (!book) {
			return res
				.status(404)
				.json({ message: "El libro no fue encontrado" });
		}
	} catch (error) {
		return res.status(500).json({
			message: error.message,
		});
	}
	res.book = book;
	next();
};

// Obtener todos los libros
router.get("/", async (req, res) => {
	try {
		const books = await Book.find();
		console.log("GET ALL", books);
		if (books.length === 0) {
			return res.status(204).json([]);
		}
		res(books);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

//Crear un nuevo recurso (libro)
router.post("/", async (req, res) => {
	const { title, author, genre, publication_date } = req?.body;
	if (!title || !author || !genre || publication_date) {
		return res
			.status(400)
			.json({ message: "OBLIGATORIOS: título,autor,género y fecha" });
	}

	const book = new Book({
		title,
		author,
		genre,
		publication_date,
	});
	try {
		const newBook = await book.save();
		console.log(newBook);
		res.status(201).json(newBook);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
});

module.exports = router;
