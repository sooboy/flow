package handler

import (
	"github.com/flosch/pongo2"
	"github.com/gin-gonic/gin"
)

func UserInfo(cxt *gin.Context) {
	var c = make(pongo2.Context)
	cxt.HTML(200, "pages/tong/tong.html", c)
}
