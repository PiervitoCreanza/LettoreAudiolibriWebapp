export const CalcFlipBoxesEqualHeights = function(res) {
    const jsOuterHeight = (el) => {
        var elHeight = el.offsetHeight;
        //elHeight += parseInt(window.getComputedStyle(el).getPropertyValue('padding-top'));
        //elHeight += parseInt(window.getComputedStyle(el).getPropertyValue('padding-bottom'));
        return elHeight
    }
    var e = []
    let i = res.querySelector('.flip-box-inner')
    let o = i.querySelector('.flip-box-front')
    let s = i.querySelector('.flip-box-back')
    i.style.minHeight = ""
    o.style.position = ""
    s.style.bottom = ""
    e.push(Math.max(jsOuterHeight(o), jsOuterHeight(s)))
    let n = Math.max.apply(null, e)
    i.style.minHeight = n + "px"
    o.style.position = "absolute"
    s.style.bottom = "0"
}


/*
const CalcFlipBox = () => {
    CalcFlipBoxesEqualHeights = function(res) {
        var e = []
        res.find(".flip-box-inner").each(function() {
            var i = $(this)
            var o = i.find(".flip-box-front")
            var s = i.find(".flip-box-back")
            i.css("min-height", ""),
            o.css("position", ""),
            s.css("bottom", ""),
            e.push(Math.max(o.outerHeight(), s.outerHeight()))
        }),
        console.log(e)
        n = Math.max.apply(null, e),
        res.find(".flip-box-inner").each(function() {
            var i = $(this)
            var o = i.find(".flip-box-front")
            var s = i.find(".flip-box-back")
            i.css("min-height", n),
            o.css("position", "absolute"),
            s.css("bottom", "0")
        })
    }
    
    setTimeout(()=> {
        $(".flip-box").each(function() {
            CalcFlipBoxesEqualHeights($(this))
        })
    }, 350)
}


$(window).resize(
    function() {
        $(".flip-box").each(function() {
            CalcFlipBoxesEqualHeights($(this))
        })
})*/