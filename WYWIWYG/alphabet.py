size(2000, 2000)

def drawGrid(numberOfLines, hint=0, labels=False):
    # draw between 1 and mumberOfLines lines
    for i in range(1, numberOfLines):
        #set stroke weight and color
        strokeWidth(0.5)
        stroke(0)
        # check if hints are wanted, otherwise skip
        if(hint!=0 and i%hint==0):
            # set stroke and color for hints
            stroke(1,0,0)
            strokeWidth(1)
        # draw lines for the grid
        line((0, i*height()/numberOfLines), (width(),i*height()/numberOfLines))
        if (labels == True): text(str(i), (0, i*height()/numberOfLines))
        line((i*width()/numberOfLines, 0), (i*width()/numberOfLines, height()))
        if (labels == True): text(str(i), (i*width()/numberOfLines, 0))
        
        
def showPoints(points, labels=False):
    # enumerate and index points
    for index, p in enumerate(points):
        x, y = p
        # draw an oval for each point
        oval(x-4,y-4, 8, 8)
        # if labels are set, label the points
        if labels == True: text(str(index+1), (x+8, y+4))
        
def A(x, y):
    path = BezierPath()
    
    path.moveTo((x, y))
    path.lineTo((x+20, y))
    path.lineTo((x+95, y+220))
    path.lineTo((x+75, y+220))
    
    path.closePath()  
    drawPath(path)
    
    path.moveTo((x+80, y+195))
    path.lineTo((x+100, y+195))
    path.lineTo((x+100, y+220))
    path.lineTo((x+80, y+220))
    
    path.closePath()  
    drawPath(path)
    
    path.moveTo((x+85,y+220))
    path.lineTo((x+105,y+220))
    path.lineTo((x+180,y))
    path.lineTo((x+160,y))
    
    
    path.closePath()  
    drawPath(path)
    
    path.moveTo((x+30, y+70))
    path.lineTo((x+150, y+70))
    path.lineTo((x+150, y+85))
    path.lineTo((x+30, y+85))
        
    path.closePath()  
    drawPath(path)
    #showPoints(path.points, True)
    
def B(x, y):
    path = BezierPath()
    
    path.moveTo((x, y))
    path.lineTo((x+20, y))
    path.lineTo((x+20, y+220))
    path.lineTo((x, y+220))
    
    path.closePath()  
    drawPath(path)
    
    path.moveTo((x, y))
    path.lineTo((x, y+15))
    path.lineTo((x+60, y+15))
    path.lineTo((x+60, y))
        
    path.closePath()  
    drawPath(path)
    
    path.moveTo((x+60, y))
    path.curveTo((x+165,y),(x+165,y+120),(x+60,y+120))
    path.lineTo((x+60, y+105))
    path.curveTo((x+145,y+105),(x+145,y+25),(x+60,y+15))
    
    path.closePath()  
    drawPath(path)
    
    path.moveTo((x, y+105))
    path.lineTo((x, y+120))
    path.lineTo((x+60, y+120))
    path.lineTo((x+60, y+105))
    
    path.closePath()  
    drawPath(path)
    
    path.moveTo((x, y+205))
    path.lineTo((x, y+220))
    path.lineTo((x+60, y+220))
    path.lineTo((x+60, y+205))
    
    path.moveTo((x+60, y+105))
    path.curveTo((x+150,y+105),(x+150,y+220),(x+60,y+220))
    path.lineTo((x+60, y+205))
    path.curveTo((x+130,y+205),(x+130,y+120),(x+60,y+120))

    path.closePath()  
    drawPath(path)
    #showPoints(path.points, True)
    
def C(x, y):
    path = BezierPath()
    
    path.moveTo((x+130,y))
    path.lineTo((x+130,y+20))
    path.curveTo((x+25,y+20),(x+25,y+200),(x+130,y+200))
    path.lineTo((x+130,y+220))
    path.curveTo((x,y+220),(x,y),(x+130,y))
    
    path.closePath()
    drawPath(path)
    
    path.moveTo((x+130,y))
    path.curveTo((x+175,y),(x+205,y+20),(x+210,y+60))
    path.lineTo((x+190,y+60))
    path.curveTo((x+190,y+50),(x+185,y+15),(x+120,y+20))
    
    path.closePath()
    drawPath(path)
    
    path.moveTo((x+130,y+220))
    path.curveTo((x+175,y+220),(x+205,y+200),(x+210,y+160))
    path.lineTo((x+190,y+160))
    path.curveTo((x+190,y+170),(x+185,y+205),(x+120,y+200))
    
    path.closePath()
    drawPath(path)

    #showPoints(path.points, True)
    
def D(x, y):
    path = BezierPath()
    
    path.moveTo((x, y))
    path.lineTo((x+20, y))
    path.lineTo((x+20, y+220))
    path.lineTo((x, y+220))
    
    path.closePath()  
    drawPath(path)
    
    path.moveTo((x, y))
    path.lineTo((x, y+15))
    path.lineTo((x+60, y+15))
    path.lineTo((x+60, y))
        
    path.closePath()  
    drawPath(path)
    
    path.moveTo((x+60, y))
    path.curveTo((x+195,y),(x+195,y+220),(x+60,y+220))
    path.lineTo((x+60, y+205))
    path.curveTo((x+170,y+195),(x+170,y+25),(x+60,y+15))
    
    path.closePath()  
    drawPath(path)
    
    path.moveTo((x, y+205))
    path.lineTo((x, y+220))
    path.lineTo((x+60, y+220))
    path.lineTo((x+60, y+205))

    path.closePath()  
    drawPath(path)
    #showPoints(path.points, True)
    
def E(x, y):
    path = BezierPath()
    
    path.moveTo((x, y))
    path.lineTo((x+20, y))
    path.lineTo((x+20, y+220))
    path.lineTo((x, y+220))
    
    path.closePath()  
    drawPath(path)
    
    path.moveTo((x,y+105))
    path.lineTo((x+110,y+105))
    path.lineTo((x+110, y+120))
    path.lineTo((x, y+120))
    
    path.closePath()  
    drawPath(path)
    
    path.moveTo((x,y+205))
    path.lineTo((x+120,y+205))
    path.lineTo((x+120, y+220))
    path.lineTo((x, y+220))
    
    path.closePath()  
    drawPath(path)
    
    path.moveTo((x,y))
    path.lineTo((x+120,y))
    path.lineTo((x+120, y+15))
    path.lineTo((x, y+15))
    
    path.closePath()  
    drawPath(path)
    #showPoints(path.points, True)
    
def F(x, y):
    path = BezierPath()
    
    path.moveTo((x, y))
    path.lineTo((x+20, y))
    path.lineTo((x+20, y+220))
    path.lineTo((x, y+220))
    
    path.closePath()  
    drawPath(path)
    
    path.moveTo((x,y+105))
    path.lineTo((x+110,y+105))
    path.lineTo((x+110, y+120))
    path.lineTo((x, y+120))
    
    path.closePath()  
    drawPath(path)
    
    path.moveTo((x,y+205))
    path.lineTo((x+120,y+205))
    path.lineTo((x+120, y+220))
    path.lineTo((x, y+220))
    
    path.closePath()  
    drawPath(path)
    #showPoints(path.points, True)
    
def G(x, y):
    path = BezierPath()
    
    path.moveTo((x+130,y))
    path.lineTo((x+130,y+20))
    path.curveTo((x+25,y+20),(x+25,y+200),(x+130,y+200))
    path.lineTo((x+130,y+220))
    path.curveTo((x,y+220),(x,y),(x+130,y))
    
    path.closePath()
    drawPath(path)
    
    path.moveTo((x+130,y))
    path.curveTo((x+175,y),(x+205,y+20),(x+210,y+35))
    path.lineTo((x+190,y+40))
    path.curveTo((x+190,y+50),(x+185,y+15),(x+120,y+20))
    
    path.closePath()
    drawPath(path)
    
    path.moveTo((x+130,y+220))
    path.curveTo((x+175,y+220),(x+205,y+200),(x+210,y+160))
    path.lineTo((x+190,y+160))
    path.curveTo((x+190,y+170),(x+185,y+205),(x+120,y+200))
    
    path.closePath()
    drawPath(path)
    
    path.moveTo((x+130,y+120))
    path.lineTo((x+130,y+105))
    path.lineTo((x+210,y+105))
    path.lineTo((x+210,y+120))
    
    path.moveTo((x+210,y+120))
    path.lineTo((x+190,y+120))
    path.lineTo((x+190,y+30))
    path.lineTo((x+210,y+35))
    
    path.closePath()
    drawPath(path)

    #showPoints(path.points, True)
    
    
def H(x, y):
    path = BezierPath()
    
    path.moveTo((x, y))
    path.lineTo((x+20, y))
    path.lineTo((x+20, y+220))
    path.lineTo((x, y+220))
    
    path.closePath()  
    drawPath(path)
    
    path.moveTo((x+130, y))
    path.lineTo((x+150, y))
    path.lineTo((x+150, y+220))
    path.lineTo((x+130, y+220))
    
    path.closePath()  
    drawPath(path)
    
    path.moveTo((x,y+105))
    path.lineTo((x+150,y+105))
    path.lineTo((x+150, y+120))
    path.lineTo((x, y+120))
    
    path.closePath()  
    drawPath(path)
    #showPoints(path.points, True)
    
def I(x, y):
    path = BezierPath()
    
    path.moveTo((x, y))
    path.lineTo((x+20, y))
    path.lineTo((x+20, y+220))
    path.lineTo((x, y+220))
    
    path.closePath()  
    drawPath(path)
    #showPoints(path.points, True)

def J(x, y):
    path = BezierPath()
    
    path.moveTo((x+100, y+40))
    path.lineTo((x+120, y+40))
    path.lineTo((x+120, y+220))
    path.lineTo((x+100, y+220))
    
    path.closePath()  
    drawPath(path)
    
    path.moveTo((x, y+50))
    path.curveTo((x, y-26),(x+120, y-26),(x+120, y+50))
    path.lineTo((x+100, y+50))
    path.curveTo((x+100, y),(x+20, y),(x+20, y+50))
    
    path.closePath()  
    drawPath(path)
    #showPoints(path.points, True)
        
    
def L(x, y):
    path = BezierPath()
    
    path.moveTo((x, y))
    path.lineTo((x+20, y))
    path.lineTo((x+20, y+220))
    path.lineTo((x, y+220))
    
    path.closePath()
    drawPath(path)
    
    path.moveTo((x, y))
    path.lineTo((x, y+15))
    path.lineTo((x+135, y+15))
    path.lineTo((x+135, y))
        
    path.closePath()  
    drawPath(path)
    #showPoints(path.points, True)
    
    
def K(x,y):
    path = BezierPath()
    
    path.moveTo((x, y))
    path.lineTo((x+20, y))
    path.lineTo((x+20, y+220))
    path.lineTo((x, y+220))
    
    path.closePath()
    drawPath(path)
    
    path.moveTo((x+20,y+105))
    path.lineTo((x+30,y+105))
    path.lineTo((x+30,y+115))
    path.lineTo((x+20,y+115))
    
    path.closePath()
    drawPath(path)
    
    path.moveTo((x+25, y+110))
    path.lineTo((x+115, y+220))
    path.lineTo((x+135, y+220))
    path.lineTo((x+50, y+110))
    
    path.closePath()
    drawPath(path)
    
    path.moveTo((x+25, y+110))
    path.lineTo((x+125, y))
    path.lineTo((x+150, y))
    path.lineTo((x+50, y+110))
    
    path.closePath()
    drawPath(path)
    #showPoints(path.points, True)
    
def M(x, y):
    path = BezierPath()
    
    path.moveTo((x+90, y))
    path.lineTo((x+110, y))
    path.lineTo((x+110, y+25))
    path.lineTo((x+90, y+25))
    
    path.closePath()
    drawPath(path)
    
    path.moveTo((x+100, y))
    path.lineTo((x+175, y+220))
    path.lineTo((x+195, y+220))
    path.lineTo((x+120, y))
    
    path.closePath()
    drawPath(path)
    
    path.moveTo((x+170, y+195))
    path.lineTo((x+195, y+195))
    path.lineTo((x+195, y+220))
    path.lineTo((x+180, y+220))
    
    path.closePath()
    drawPath(path)
    
    path.moveTo((x, y+195))
    path.lineTo((x+40, y+195))
    path.lineTo((x+35, y+220))
    path.lineTo((x, y+220))
    
    path.closePath()
    drawPath(path)
    
    path.moveTo((x+90,y))
    path.lineTo((x+15,y+220))
    path.lineTo((x+35,y+220))
    path.lineTo((x+110,y))    

    path.closePath()
    drawPath(path)
    
    path.moveTo((x, y))
    path.lineTo((x+20, y))
    path.lineTo((x+20, y+220))
    path.lineTo((x, y+220))

    path.closePath()
    drawPath(path)
    
    path.moveTo((x+190, y))
    path.lineTo((x+210, y))
    path.lineTo((x+210, y+220))
    path.lineTo((x+190, y+220))
    
    path.closePath()
    drawPath(path)
    #showPoints(path.points, True)
    
def N(x, y):
    path = BezierPath()
    
    path.moveTo((x, y))
    path.lineTo((x+20, y))
    path.lineTo((x+20, y+220))
    path.lineTo((x, y+220))
    
    path.closePath()
    drawPath(path)
    
    path.moveTo((x+165, y))
    path.lineTo((x+185, y))
    path.lineTo((x+185, y+220))
    path.lineTo((x+165, y+220))
    
    path.closePath()
    drawPath(path)
    
    path.moveTo((x+150, y))
    path.lineTo((x+175, y))
    path.lineTo((x+30, y+220))
    path.lineTo((x+10, y+220))
    
    path.closePath()
    drawPath(path)
    
    path.moveTo((x, y+195))
    path.lineTo((x+30, y+195))
    path.lineTo((x+25, y+220))
    path.lineTo((x, y+220))
    
    path.closePath()
    drawPath(path)
    
    path.moveTo((x, y+195))
    path.lineTo((x+40, y+195))
    path.lineTo((x+25, y+220))
    path.lineTo((x, y+220))
    
    path.closePath()
    drawPath(path)
    
    path.moveTo((x+150, y))
    path.lineTo((x+170, y))
    path.lineTo((x+170, y+25))
    path.lineTo((x+150, y+25))
    
    path.closePath()
    drawPath(path)
    #showPoints(path.points, True)
    
def O(x, y):
    path = BezierPath()
    
    path.moveTo((x+130,y))
    path.lineTo((x+130,y+20))
    path.curveTo((x+25,y+20),(x+25,y+200),(x+130,y+200))
    path.lineTo((x+130,y+220))
    path.curveTo((x,y+220),(x,y),(x+130,y))
    
    path.closePath()
    drawPath(path)
    
    path.moveTo((x+130,y))
    path.lineTo((x+130,y+20))
    path.curveTo((x+230,y+20),(x+230,y+200),(x+130,y+200))
    path.lineTo((x+130,y+220))
    path.curveTo((x+255,y+220),(x+255,y),(x+130,y))    
    
    path.closePath()
    drawPath(path)
    
    #showPoints(path.points, True)
    
def P(x, y):
    path = BezierPath()
    
    path.moveTo((x, y))
    path.lineTo((x+20, y))
    path.lineTo((x+20, y+220))
    path.lineTo((x, y+220))
    
    path.closePath()  
    drawPath(path)
    
    path.moveTo((x, y+105))
    path.lineTo((x, y+120))
    path.lineTo((x+60, y+120))
    path.lineTo((x+60, y+105))
    
    path.closePath()  
    drawPath(path)
    
    path.moveTo((x, y+205))
    path.lineTo((x, y+220))
    path.lineTo((x+60, y+220))
    path.lineTo((x+60, y+205))
    
    path.moveTo((x+60, y+105))
    path.curveTo((x+150,y+105),(x+150,y+220),(x+60,y+220))
    path.lineTo((x+60, y+205))
    path.curveTo((x+130,y+205),(x+130,y+120),(x+60,y+120))

    path.closePath()  
    drawPath(path)
    #showPoints(path.points, True)
    
def Q(x, y):
    path = BezierPath()
    
    path.moveTo((x+130,y))
    path.lineTo((x+130,y+20))
    path.curveTo((x+25,y+20),(x+25,y+200),(x+130,y+200))
    path.lineTo((x+130,y+220))
    path.curveTo((x,y+220),(x,y),(x+130,y))
    
    path.closePath()
    drawPath(path)
    
    path.moveTo((x+130,y))
    path.lineTo((x+130,y+20))
    path.curveTo((x+230,y+20),(x+230,y+200),(x+130,y+200))
    path.lineTo((x+130,y+220))
    path.curveTo((x+255,y+220),(x+255,y),(x+130,y))    
    
    path.closePath()
    drawPath(path)
    
    path.moveTo((x+240,y))
    path.lineTo((x+240,y+20))
    path.curveTo((x+150,y+25),(x+190,y+5),(x+130,y+20))
    path.lineTo((x+130,y))
    path.curveTo((x+200,y+5),(x+190,y+10),(x+240,y))
    
    path.closePath()
    drawPath(path)
    
    #showPoints(path.points, True)
    
def R(x, y):
    path = BezierPath()
    
    path.moveTo((x, y))
    path.lineTo((x+20, y))
    path.lineTo((x+20, y+220))
    path.lineTo((x, y+220))
    
    path.closePath()  
    drawPath(path)
    
    path.moveTo((x, y+105))
    path.lineTo((x, y+120))
    path.lineTo((x+60, y+120))
    path.lineTo((x+60, y+105))
    
    path.closePath()  
    drawPath(path)
    
    path.moveTo((x, y+205))
    path.lineTo((x, y+220))
    path.lineTo((x+60, y+220))
    path.lineTo((x+60, y+205))
    
    path.moveTo((x+60, y+105))
    path.curveTo((x+150,y+105),(x+150,y+220),(x+60,y+220))
    path.lineTo((x+60, y+205))
    path.curveTo((x+130,y+205),(x+130,y+120),(x+60,y+120))

    path.closePath()  
    drawPath(path)
    
    path.moveTo((x+60, y+105))
    path.lineTo((x+60, y+120))
    path.curveTo((x+155, y+120),(x+120, y+40),(x+135, y))
    path.lineTo((x+115, y))
    path.curveTo((x+110, y+120),(x+100, y+100),(x+60, y+105))
    
    path.closePath()  
    drawPath(path)
    
    #showPoints(path.points, True)
    
def S(x, y):
    path = BezierPath()
    
    path.moveTo((x+145,y+105))
    path.lineTo((x+155,y+120))
    path.curveTo((x+75,y+135),(x+80,y+200),(x+150,y+200))
    path.lineTo((x+150,y+220))
    path.curveTo((x+50,y+220),(x+45,y+115),(x+150,y+100))
    
    path.closePath()
    drawPath(path)
    
    path.moveTo((x+130,y+220))
    path.curveTo((x+175+30,y+225),(x+205+20,y+200),(x+210+20,y+160))
    path.lineTo((x+190+20,y+160))
    path.curveTo((x+190+20,y+170),(x+185+20,y+205),(x+120+20,y+200))
    
    path.closePath()
    drawPath(path)
    
    path.moveTo((x+145,y+105))
    path.lineTo((x+155,y+120))
    path.curveTo((x+300-15,y+115),(x+300-20-10,y-10),(x+150,y))
    path.lineTo((x+150,y+20))
    path.curveTo((x+300-45-10,y+10),(x+300-35-20,y+100),(x+150,y+100))
    
    path.closePath()
    drawPath(path)
    
    path.moveTo((x+150,y))
    path.curveTo((x+300-175-20,y),(x+300-205-20,y+20),(x+300-210-20,y+60))
    path.lineTo((x+110-20,y+60))
    path.curveTo((x+300-190-20,y+50),(x+300-185-20,y+15),(x+300-120-20,y+20))
    
    path.closePath()
    drawPath(path)

    #showPoints(path.points, True)
    
def T(x, y):
    path = BezierPath()
    
    path.moveTo((x+80, y))
    path.lineTo((x+100, y))
    path.lineTo((x+100, y+220))
    path.lineTo((x+80, y+220))
    
    path.moveTo((x, y+220))
    path.lineTo((x, y+205))
    path.lineTo((x+180, y+205))
    path.lineTo((x+180, y+220))
    
    path.closePath()
    drawPath(path)
    #showPoints(path.points, True)
    
def U(x, y):
    path = BezierPath()
    
    path.moveTo((x, y+80))
    path.lineTo((x+20, y+80))
    path.lineTo((x+20, y+220))
    path.lineTo((x, y+220))
    
    path.moveTo((x+150, y+80))
    path.lineTo((x+170, y+80))
    path.lineTo((x+170, y+220))
    path.lineTo((x+150, y+220))
    
    path.moveTo((x, y+80))
    path.curveTo((x, y-26),(x+170, y-26),(x+170, y+80))
    path.lineTo((x+150, y+80))
    path.curveTo((x+150, y),(x+20, y),(x+20, y+80))
    
    path.closePath()
    drawPath(path)
    #showPoints(path.points, True)
    
def V(x, y):
    path = BezierPath()
    
    path.moveTo((x+75, y))
    path.lineTo((x+95, y))
    path.lineTo((x+95, y+25))
    path.lineTo((x+75, y+25))
    
    path.closePath()
    drawPath(path)
    
    path.moveTo((x+85, y))
    path.lineTo((x+160, y+220))
    path.lineTo((x+180, y+220))
    path.lineTo((x+105, y))
    
    path.closePath()
    drawPath(path)
    
    path.moveTo((x+75,y))
    path.lineTo((x,y+220))
    path.lineTo((x+20,y+220))
    path.lineTo((x+95,y))    

    path.closePath()
    drawPath(path)
    #showPoints(path.points, True)
    
def W(x, y):
    path = BezierPath()
    
    path.moveTo((x+75, y))
    path.lineTo((x+95, y))
    path.lineTo((x+95, y+25))
    path.lineTo((x+75, y+25))
    
    path.closePath()
    drawPath(path)
    
    path.moveTo((x+85, y))
    path.lineTo((x+160, y+220))
    path.lineTo((x+180, y+220))
    path.lineTo((x+105, y))
    
    path.closePath()
    drawPath(path)
    
    path.moveTo((x+75,y))
    path.lineTo((x,y+220))
    path.lineTo((x+20,y+220))
    path.lineTo((x+95,y))    

    path.closePath()
    drawPath(path)
    
    path.moveTo((x+75+160, y))
    path.lineTo((x+95+160, y))
    path.lineTo((x+95+160, y+25))
    path.lineTo((x+75+160, y+25))
    
    path.closePath()
    drawPath(path)
    
    path.moveTo((x+85+160, y))
    path.lineTo((x+160+160, y+220))
    path.lineTo((x+180+160, y+220))
    path.lineTo((x+105+160, y))
    
    path.closePath()
    drawPath(path)
    
    path.moveTo((x+75+160,y))
    path.lineTo((x+160,y+220))
    path.lineTo((x+20+160,y+220))
    path.lineTo((x+95+160,y))    

    path.closePath()
    drawPath(path)
    #showPoints(path.points, True)
    
def Y(x, y):
    path = BezierPath()
    
    path.moveTo((x+80, y))
    path.lineTo((x+100, y))
    path.lineTo((x+100, y+90))
    path.lineTo((x+80, y+90))
    
    path.moveTo((x+80, y+90))
    path.lineTo((x+160, y+220))
    path.lineTo((x+180, y+220))
    path.lineTo((x+100, y+90))
    
    path.moveTo((x+80,y+90))
    path.lineTo((x,y+220))
    path.lineTo((x+20,y+220))
    path.lineTo((x+100,y+90))    

    path.closePath()
    drawPath(path)
    #showPoints(path.points, True)
    
def X(x, y):
    path = BezierPath()
    
    path.moveTo((x+5, y))
    path.lineTo((x+95, y+110))
    path.lineTo((x+115, y+105))
    path.lineTo((x+25, y))
    
    path.closePath()
    drawPath(path)
    
    path.moveTo((x+90,y+110))
    path.lineTo((x+110,y+105))
    path.lineTo((x+200,y+220))
    path.lineTo((x+180,y+220))
    
    path.closePath()
    drawPath(path)
    
    path.moveTo((x+175,y))
    path.lineTo((x,y+220))
    path.lineTo((x+25,y+220))
    path.lineTo((x+200,y))    

    path.closePath()
    drawPath(path)
    #showPoints(path.points, True)
    
def Z(x, y):
    path = BezierPath()
    
    path.moveTo((x, y+220))
    path.lineTo((x, y+205))
    path.lineTo((x+165, y+205))
    path.lineTo((x+165, y+220))
    
    path.closePath()
    drawPath(path)
    
    path.moveTo((x, y))
    path.lineTo((x, y+15))
    path.lineTo((x+165, y+15))
    path.lineTo((x+165, y))
    
    path.closePath()
    drawPath(path)
    
    
    path.moveTo((x, y+15))
    path.lineTo((x+150, y+220))
    path.lineTo((x+165, y+205))
    path.lineTo((x+15, y))
    
    path.closePath()
    drawPath(path)
    #showPoints(path.points, True)
    
drawGrid(100, 5)


# 

# draw a at 0,100
A(20, 100)
B(220, 100)
C(350, 100)
D(600, 100)
E(800, 100)
F(975, 100)
G(1100, 100)
H(1350, 100)
I(1550, 100)
J(1600, 100)
K(1750, 100)
L(20, 400)
M(200, 400)
N(450, 400)
O(625, 400)
P(875, 400)
Q(985, 400)
R(1250, 400)
S(1350, 400)
T(1600, 400)
U(1800, 400)
V(20, 700)
W(250, 700)
X(625, 700)
Y(850, 700)
Z(1050, 700)
