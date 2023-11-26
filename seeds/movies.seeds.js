const mongoose = require('mongoose');
require('dotenv').config();
const Movie = require('../models/Movie');

const movies = [
    {
      title: 'The Matrix',
      director: 'Hermanas Wachowski',
      year: 1999,
      genre: 'Acción',
    },
    {
      title: 'The Matrix Reloaded',
      director: 'Hermanas Wachowski',
      year: 2003,
      genre: 'Acción',
    },
    {
      title: 'Buscando a Nemo',
      director: 'Andrew Stanton',
      year: 2003,
      genre: 'Animación',
    },
    {
      title: 'Buscando a Dory',
      director: 'Andrew Stanton',
      year: 2016,
      genre: 'Animación',
    },
    {
      title: 'Interestelar',
      director: 'Christopher Nolan',
      year: 2014,
      genre: 'Ciencia ficción',
    },
    {
      title: '50 primeras citas',
      director: 'Peter Segal',
      year: 2004,
      genre: 'Comedia romántica',
    },
];

const movieDocuments = movies.map(movie => new Movie(movie));

mongoose.connect(process.env.MONGODB_URL, {
    //useNewUrlParser: true,
    //useUnifiedTopology: true
})
.then(async() => {
    console.log('Conectado a MongoDB Atlas');
    const allMovies = await Movie.find();
    if (allMovies.length){
        console.log('Había películas, vamos a borrarlas');
        await Movie.collection.drop();
        console.log('Colección de películas borrada');
    }
    
})
.catch((err) => console.log('Error al borrar las películas', err))
.then(async () => {
    await Movie.insertMany(movieDocuments);
    console.log('Películas creadas correctamente');
})
.catch((err) => console.log(`Error al crear las películas: ${err}`))
.finally( ()=> 
    mongoose
        .disconnect()
        .then(() => console.log('Desconectado de forma exitosa')) 
);