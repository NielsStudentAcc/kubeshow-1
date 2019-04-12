package main

import (
    gintrace "gopkg.in/DataDog/dd-trace-go.v1/contrib/gin-gonic/gin"
    "gopkg.in/DataDog/dd-trace-go.v1/ddtrace/tracer"

    "github.com/gin-gonic/gin"
)

func main() {

    tracer.Start()
    defer tracer.Stop()

    // Create a gin.Engine
    r := gin.New()

    // Use the tracer middleware with your desired service name.
    r.Use(gintrace.Middleware("my-web-app"))

    // Continue using the router as normal.
    r.GET("/hello", func(c *gin.Context) {
        c.String(200, "Hello World!")
    })

    r.Run(":8080")
}
}
