require('dotenv').config();
const mongoose = require('mongoose');
const Blog = require('../models/blog');
const { cloneDeep, omit } = require('lodash');

const connectToDatabase = async () => {
    try {
        await mongoose.connect(process.env.CONNECTION_URL, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
        });
        console.log('Database connection successful');

        await Blog.find({}).then((blogs) => {
            return Promise.all(blogs.map((blog) => {
                // Convert to plain object
                const cloneBlog = cloneDeep(blog)
                // cloneBlog.set('accessTitle', undefined, { strict: false });

                cloneBlog.path = cloneBlog.title.toLocaleLowerCase().replaceAll(" ", "-")

                if (cloneBlog.image) {
                    cloneBlog.thumbnail = cloneBlog.image;
                }
                cloneBlog.set('image', undefined, { strict: false })
                console.log(cloneBlog)
                return cloneBlog.save();
            })
            )
        });
    } catch (error) {
        console.error('Error connecting to the database:', error.message);
    } finally {
        await mongoose.connection.close();
    }
};

connectToDatabase();