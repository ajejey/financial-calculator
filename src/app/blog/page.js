import { blogs } from '@/Blogs/data'
import { Card, CardContent, CardMedia, Typography } from '@mui/material'
import Link from 'next/link'
import React from 'react'

const page = () => {
    return (
        <div className="p-6 mx-auto">
            <h1 className="text-4xl font-bold mb-8 text-center">Blogs</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {blogs.map((item, index) => (
                    <Link href={item.link} key={index}>
                    <div 
                        key={index}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Card className="shadow-lg transition-shadow hover:shadow-2xl">
                            <CardMedia component={"img"} height="200" image={item.image} alt={item.title} />
                            <CardContent className="p-6">
                                <Typography 
                                    gutterBottom 
                                    variant="h5" 
                                    component="div"
                                    className="font-semibold text-gray-800"
                                >
                                    {item.title}
                                </Typography>
                                <Typography 
                                    variant="body2" 
                                    color="text.secondary"
                                    className="text-gray-600"
                                >
                                    {item.description}
                                </Typography>
                            </CardContent>
                        </Card>
                    </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}

export default page
