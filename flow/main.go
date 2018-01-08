package main

import (
	"flow.smm.cn/flow.v1/handler"

	"github.com/gin-gonic/gin"
	"github.com/robvdl/pongo2gin"
)

func main() {
	engine := gin.Default()

	engine.HTMLRender = pongo2gin.New(pongo2gin.RenderOptions{
		TemplateDir: "templates/",
		ContentType: "text/html; charset=utf-8",
	})

	engine.Static("/static", "./static")

	engine.GET("/", handler.UserInfo)

	engine.Run(":8080")
}
