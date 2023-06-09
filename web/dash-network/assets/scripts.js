$(document).ready(function () {

    var N_CLICKS = 0
    var ANIMATION_ARTIFICIALLY_PAUSED = false
    var ANIMATION_NATURALLY_STOPPED = 0
    // 0: init state - on / has never stopped
    // 1: off / has stopped
    // 2: on // continues
    
    function loadEverything() {
        setTimeout(() => {
            legend()
            searchbar()
            nodeinfo()
            fadingeffect()
            getSchemeReady()
            getDelayReady()
            getBodyReady()
            getL2opacReady()
            getL2plusopacReady()
            getfadeLabelsReady()
            click2clear()
            nodeposition()
            controls()
            others()
        }, 1000)
    }
    loadEverything()

    function legend() {
        var handle = setInterval(function() {
            var done = addLegend()
            if (done)
                clearInterval(handle)
        }, 100);
    }

    function searchbar() {
        var handle = setInterval(function() {
            var done = loadSearchBar()
            if (done)
                clearInterval(handle)
        }, 100)
    }

    function nodeinfo() {
        var handle = setInterval(function() {
            var done = loadNodeInfo()
            if (done)
                clearInterval(handle)
        }, 100)
    }

    function fadingeffect() {
        var handle = setInterval(function() {
            var done = addFadingEffect()
            if (done)
                clearInterval(handle)
        }, 100)
    }

    function getSchemeReady() {
        var handle = setInterval(function() {
            var done = schemeNetwork()
            if (done)
                clearInterval(handle)
        }, 100)
    }

    function getDelayReady() {
        var handle = setInterval(function() {
            var done = delayNetwork()
            if (done)
                clearInterval(handle)
        }, 100)
    }

    function getBodyReady() {
        var handle = setInterval(function() {
            var done = bodyNetwork()
            if (done)
                clearInterval(handle)
        }, 100)
    }

    function getL2opacReady() {
        var handle = setInterval(function() {
            var done = L2opacNetwork()
            if (done)
                clearInterval(handle)
        }, 100)
    }

    function getL2plusopacReady() {
        var handle = setInterval(function() {
            var done = L2plusopacNetwork()
            if (done)
                clearInterval(handle)
        }, 100)
    }

    function getfadeLabelsReady() {
        var handle = setInterval(function() {
            var done = fadeLabelsNetwork()
            if (done)
                clearInterval(handle)
        }, 100)
    }

    function click2clear() {
        var handle = setInterval(function() {
            var done = clickToClear()
            if (done)
                clearInterval(handle)
        }, 100)
    }

    function nodeposition() {
        var handle = setInterval(function() {
            var done = checkNodePosition()
            if (done)
                clearInterval(handle)
        }, 100)
    }

    function controls() {
        var handle = setInterval(function() {
            var done = addControlFuncionality()
            if (done)
                clearInterval(handle)
        }, 100);
    }

    function others() {
        NH = false
        
        $('#link-neighbors').click(function() {
            NH = false
            $('#link-neighbors').addClass('selected')
            $('#link-hierarchy').removeClass('selected')
            return false
        })
        $('#link-hierarchy').click(function() {
            NH = true
            $('#link-neighbors').removeClass('selected')
            $('#link-hierarchy').addClass('selected')
            return false
        })
    }

    var DELAY = 0, L2OPAC = 1, NONSELOPAC = 0.05, FADELABELS = true
    var depthText // = $('#depth .Select-value-label').text()
    var depth = 1 // parseInt(depthText.split('-')[0].trim())
    var opacVector = new Array(depth+1).fill(L2OPAC)
    var STANDALONE = '#a0a0a0' //'#cecece'
    var NH = false

    function schemeNetwork() {
        var ready = $('#scheme').length > 0
        if (ready) {
            $('#scheme').change(function (ev) {
                for(var i = 65; i < 91; i++) {
                    var char = String.fromCharCode(i)
                    var className = 'scheme' + char
                    $('.my-legend ul.legend-labels li span').removeClass(className)
                }
                $('.my-legend ul.legend-labels li span').addClass('scheme' + ev.target.value.toUpperCase())
            })
        }
        return ready
    }

    function delayNetwork() {
        var ready = $('#delay').length > 0
        if (ready) {
            $('#delay').change(function (ev) {
                DELAY = parseInt(ev.target.value)
            })
        }
        return ready
    }

    function bodyNetwork() {
        var ready = $('body').length > 0
        if (ready) {
            $('body').on('DOMSubtreeModified', '#depth .Select-value-label', function (ev) {
                //addFadingEffect()
                depthText = $('#depth .Select-value-label').text()
                depth = parseInt(depthText.split('-')[0].trim())
                opacVector = new Array(depth+1).fill(L2OPAC)
            })
        }
        return ready
    }

    function L2opacNetwork() {
        var ready = $('#L2opac').length > 0
        if (ready) {
            $('#L2opac').change(function (ev) {
                L2OPAC = parseFloat(ev.target.value)
//                addFadingEffect()
            })
        }
        return ready
    }

    function L2plusopacNetwork() {
        var ready = $('#L2plusopac').length > 0
        if (ready) {
            $('#L2plusopac').change(function (ev) {
                NONSELOPAC = parseFloat(ev.target.value)
//                addFadingEffect()
            })
        }
        return ready
    }

    function fadeLabelsNetwork() {
        var ready = $('#fadeLabels').length > 0
        if (ready) {
            $('#fadeLabels').change(function (ev) {
                FADELABELS = ev.target.value == 'Yes' ? true : false
//                addFadingEffect()
            })
        }
        return ready
    }

    function clickToClear() {
        var ready = $('#net1').length > 0
        if (ready) {
            var elems = $('.net-content svg')
            //var elem = elems[0]
            elems.click(function () {
                resetDefaultStyle()
            })
        }
        return ready
    }

    function addLegend() {
        var ready = $('#legend').length > 0
        if (ready) {
            var nodeShowText = 'Named Evening-length Show'
            var nodeContainerText = 'Container (normally a grouping of 2+ variable pieces under a shared title; also includes act-length dances with named components)'
            var nodeMixText = 'Piece or Container, at different times'
            var nodePieceText = 'Piece'
            var nodeDanceText = 'Named Dances inside of other Dances'
            var arrowDanceText = 'Source is a Dance part of the target Piece'
            var arrowPieceText = 'Source is always part of other containers'
            var arrowMixText = 'Source is always part of other containers'
            var arrowStandaloneText = 'Source is sometimes part of other containers, but may also be a standalone work'
            var defaultScheme = 'schemeD'
                //<div class='legend-title'>Node and arrow colors:</div> \
            $('#legend').html(" \
                <div class='legend-scale'> \
                  <ul class='legend-labels'> \
                    <li class='nd'><span class='node show "+defaultScheme+"'></span>"+nodeShowText+"</li> \
                    <li class='nd'><span class='node cont "+defaultScheme+"'></span>"+nodeContainerText+"</li> \
                    <li class='nd'><span class='node mix "+defaultScheme+"'></span>"+nodeMixText+"</li> \
                    <li class='nd'><span class='node piece "+defaultScheme+"'></span>"+nodePieceText+"</li> \
                    <li class='nd'><span class='node dance "+defaultScheme+"'></span>"+nodeDanceText+"</li> \
                    <li class='rw first'><span class='arrow mix "+defaultScheme+"'></span>"+arrowMixText+"</li> \
                    <li class='rw'><span class='arrow piece "+defaultScheme+"'></span>"+arrowPieceText+"</li> \
                    <li class='rw'><span class='arrow dance "+defaultScheme+"'></span>"+arrowDanceText+"</li> \
                    <li class='rw last'><span class='arrow standalone "+defaultScheme+"'></span>"+arrowStandaloneText+"</li> \
                  </ul> \
                </div> \
            ")
        }
        return ready
    }

    function loadNodeInfo() {
        var ready = $('circle').length > 0
        if (ready) {
            var circles = document.getElementsByTagName('circle')
            for (var i=0; i<circles.length; i++)
            {
                (function () {
                    var circle = circles[i]
                    var id  = circle.__data__.id
                    var aka = formatList(circle.__data__.aka.split('; '))
                    var text
                    if (!aka || aka == '<i></i>') {
                        text = '<b>' + id + '</b>'
                    }
                    else {
                        text = '<b>' + id + '</b> also appears in programs as<br>' + aka + '.'
                    }
                    //var pre = circle.__data__.premiere
                    //var text = 'Piece:\n' + id + '\n\n' + 'A.K.A.:\n' + aka + '\n\n' + 'Premiere:\n' + pre
                    $(circle).addClass('tooltip')
                    $(circle).attr('data-html', true)
                    $(circle).attr('title', text)
                    circle.addEventListener('mousedown', (ev) => {
                        if (ev.which === 3) {
                            ev.preventDefault()
                            
                            //actions here
                            var attempts = 0
                            var handle = setInterval(function() {
                                var done = document.body.style.overflowX == 'hidden'
                                if (done || attempts > 10) {
                                    window.scrollBy(0, 1)
                                    setTimeout(() => {
                                        $('.tooltipster-base').css('visibility', 'visible')
                                    }, 200)
                                    clearInterval(handle)
                                }
                            }, 100);
                            
                            
                            
                            return false;
                        }
                    })
                    circle.addEventListener('contextmenu', function(ev){
                        ev.preventDefault();
                        return false;
                    })
                    
                }())
            }
            $('.tooltip').tooltipster({
                trigger: 'hover',
                contentAsHTML: true,
            });
        }
        return ready
    }

    //var lastNode = ''
    var resetTimeout

    function addFadingEffect() {
        var c1 = $('circle').length > 0
        var c2 = $('text').length > 0
        var c3 = $('path').length > 0
        var c4 = $('marker').length > 0
        var ready = c1 && c2 && c3 && c4
        if (ready) {
            $('circle').addClass('graph-component')
            $('text').addClass('graph-component')
            $('path').addClass('graph-component')
            $('marker').addClass('graph-component')
            
            $('circle.graph-component').each((i, x) => x.setAttribute('label', x.__data__.id))
            
            var circles = document.getElementsByTagName('circle')
            var texts = document.getElementsByTagName('text')
            var paths = document.getElementsByTagName('path')
            var markers = document.getElementsByTagName('marker')
            var linkIndexDct = {}
            for (var j=0; j<paths.length; j++) {
                var p = paths[j]
                if ('__data__' in p)
                    linkIndexDct[p.__data__.index] = p
            }
            
//            var depthText = $('#depth .Select-value-label').text()
//            var depth = parseInt(depthText.split('-')[0].trim())
//            var opacVector
//            if (depth != 2) {
//                opacVector = [1]
//                for (var i=1; i<=depth; i++) {
//                    var opac = 1 - (i-1)/depth
//                    opacVector.push(opac)
//                }
//            }
//            else
//                opacVector = [1, 1, L2OPAC]
//            opacVector = new Array(depth+1).fill(L2OPAC)
//            var zeros = new Array(10).fill(NONSELOPAC)
//            opacVector.push(...zeros)
            
            for (var i=0; i<circles.length; i++) {
                (function (i) {
                    var circle = circles[i]
                    circle.addEventListener('mouseenter', (ev) => {
                        
                        var selectedNode = circle.__data__.id
                        //clearTimeout(resetTimeout)
                        //if (selectedNode != lastNode)
                        //    resetDefaultStyle()
                        //lastNode = selectedNode
                        setFadedStyle()
                        
                        //var allNeighbors = shortestDistanceMatrix[selectedNode]
                        //var allNeighbors = hierarchies[selectedNode]
                        var nhChecked = NH || false
                        var linkData = nhChecked ? hierarchies : shortestDistanceMatrix
                        var allNeighbors = linkData[selectedNode]
                        var neighbors = {}
                        for (k in allNeighbors) {
                            var v = allNeighbors[k]
                            if (v <= depth)
                                neighbors[k] = v
                        }
                        
                        for (var j=0; j<circles.length; j++) {
                            (function (j) {
                                var c = circles[j]
                                var label = c.__data__.id
                                if (label in neighbors) {
                                    var index = neighbors[label]
                                    var opac = opacVector[index]
                                    setTimeout(() => {
                                        $(c).attr('fill-opacity', opac)
                                        $(c).attr('stroke-opacity', opac)
                                    }, DELAY*index)
                                }
                            })(j)
                        }
                        if (FADELABELS) {
                            for (var j=0; j<texts.length; j++) {
                                (function (j) {
                                    var t = texts[j]
                                    var label = t.__data__.id
                                    if (label in neighbors) {
                                        var index = neighbors[label]
                                        var opac = opacVector[index]
                                        setTimeout(() => {
                                            $(t).attr('fill-opacity', opac)
                                            $(t).attr('stroke-opacity', opac)
                                        }, DELAY*index)
                                    }
                                })(j)
                            }
                        }
                        for (var j=0; j<paths.length; j++) {
                            (function (j) {
                                var p = paths[j]
                                if ('__data__' in p) {
                                    var source = p.__data__.source.id
                                    var target = p.__data__.target.id
                                    if (source in neighbors && target in neighbors) {
                                        var indexS = neighbors[source]
                                        var indexT = neighbors[target]
                                        var opacS = opacVector[indexS]
                                        var opacT = opacVector[indexT]
                                        var opac = Math.min(opacS, opacT)
                                        if (p.__data__.myedgecolor == STANDALONE)
                                            opac /= 2
                                        setTimeout(() => {
                                            $(p).attr('stroke-opacity', opac)
                                        }, DELAY*neighbors[indexS < indexT ? target : source])
                                    }
                                }
                            })(j)
                        }
                        for (var j=0; j<markers.length; j++) {
                            (function (j) {
                                var m = markers[j]
                                var name = m.id
                                var dashLastIndex = name.lastIndexOf('-')
                                var index = name.slice(dashLastIndex + 1)
                                var p = linkIndexDct[index]
                                if (typeof p !== 'undefined' && '__data__' in p) {
                                    var source = p.__data__.source.id
                                    var target = p.__data__.target.id
                                    if (source in neighbors && target in neighbors) {
                                        var indexS = neighbors[source]
                                        var indexT = neighbors[target]
                                        var opacS = opacVector[indexS]
                                        var opacT = opacVector[indexT]
                                        var opac = Math.min(opacS, opacT)
                                        if (p.__data__.myedgecolor == STANDALONE)
                                            opac /= 2
                                        setTimeout(() => {
                                            $(m).attr('fill-opacity', opac)
                                        }, DELAY*neighbors[indexS < indexT ? target : source])
                                    }
                                }
                            })(j)
                        }
                    })
                    circle.addEventListener('mouseleave', (ev) => {
                        //resetTimeout = setTimeout(() => {
                            resetDefaultStyle()
                        //}, 500)
                    })
                })(i)
            }
        }
        return ready
    }

    function loadSearchBar() {
        var c1 = $('#searchBar').length > 0
        var c2 = $('text.graph-component').length > 0
        var ready = c1 && c2
        if (ready) {
            var akasPieces = $('text.graph-component')
            akasPieces.sort(function(a, b) {
               return $(a).text().toUpperCase().localeCompare($(b).text().toUpperCase());
            })
            //var searchDivContent = 'Search bar<br>'
            var searchDivContent = ''
            searchDivContent += '<input id="searchInput" value="" placeholder="Search pieces..." style="height: 15px;" autocomplete="off">'
            searchDivContent += '<a id="searchCloseButton" href="" style="display:none;"></a>'
            searchDivContent += '<br>\n'
            searchDivContent += '<div class="searchResults" style="background-color: white; display:none">'
            searchDivContent += '<div class="searchResultsContainer">'
            searchDivContent += '<ul id="searchUL">\n'
            for (var p=0; p<akasPieces.length; p++) {
                var piece = akasPieces[p]
                var k = piece.textContent
                var color = piece.__data__.color
                searchDivContent += '<li class="liResult" style="display:none; color:'+color+'">'+k+'</li>\n'
            }
            searchDivContent += '</ul>'
            searchDivContent += '<span id="noResults" style="font-style: italic; display:none;"> No matches found.</span>'
            searchDivContent += '</div>'
            searchDivContent += '</div>'
            var searchBarDiv = document.getElementById('searchBar')
            searchBarDiv.innerHTML = searchDivContent
            searchBarDiv.addEventListener('keyup', searchPiece)
            document.getElementById('searchCloseButton').addEventListener('click', closeSearch)
            
            var toggler = document.getElementsByClassName("liResult");
            var i;
            for (i = 0; i < toggler.length; i++) {
              //(function() {
                  toggler[i].addEventListener('mousedown', function(ev) {
                    ev.preventDefault()
                    var text = ev.target.textContent
                    //var elem = $('text.graph-component').filter((i, x) => x.textContent == text)
                    var elem = $('circle.graph-component[label="'+text+'"]')
                    //$('#searchCloseButton')[0].click()
                    elem[0].scrollIntoView({behavior: 'smooth', block: 'center', inline: 'center'})
                    elem[0].dispatchEvent(new MouseEvent('mouseenter'))
                    //$('#searchBar').blur()
                    return false
                })
            }
            
            function searchPiece(ev) {
              ev.preventDefault()
              // Declare variables
              var input, filter, ul, li, a, i, txtValue;
              input = document.getElementById('searchInput');
              filter = input.value.toUpperCase();
              
              if (filter.length > 0) {
                  $('.optional').hide() // Hide optional options
                  $('#searchCloseButton').show()
                  $('div.searchResults').show()
                  ul = document.getElementById("searchUL");
                  li = ul.getElementsByTagName('li');
                  var counter = 0
                  // Loop through all list items, and hide those who don't match the search query
                  for (i = 0; i < li.length; i++) {
                    a = li[i]//.getElementsByTagName("a")[0];
                    txtValue = a.textContent || a.innerText;
                    if (txtValue.toUpperCase().indexOf(filter) > -1) {
                      li[i].style.display = "";
                      counter ++;
                    } else {
                      li[i].style.display = "none";
                    }
                  }
                  if (counter) {
                    $('#noResults').hide()
                    $('.searchResults').css({'background-color': 'white'})
                  }
                  else {
                    $('#noResults').show()
                    $('.searchResults').css({'background-color': 'rgb(0,0,0,0)'})
                  }
                //$('#searchBar')[0].scrollIntoView({behavior: 'smooth', block: 'start', inline: 'end'})
              }
              else {
                  //$('#searchCloseButton').hide()
                  $('#searchUL li.liResult').hide()
                  $('div.searchResults').hide()
                  //$('.ulPlaces').show()
              }
            }
            
            function closeSearch(ev) {
                ev.preventDefault()
              document.getElementById('searchInput').value = ''
              $('#searchCloseButton').hide()
              $('#searchUL li.liResult').hide()
              $('div.searchResults').hide()
              //$('.ulPlaces').show()
                //$('#searchBar')[0].scrollIntoView({behavior: 'smooth', block: 'end', inline: 'end'})
                $( "#sidebar .content" ).slideDown("slow", function() {
                    $('#info')[0].scrollIntoView({behavior: 'smooth', block: 'end', inline: 'end'})
                    $('#searchBar').css({'margin-top': '0px'})
                })
            }
            
            document.getElementById('searchInput').addEventListener('focusin', (ev) => {
                $( "#sidebar .content" ).slideUp("slow", function() {
                    $('#searchBar').css({'margin-top': '-10px'})
                    $('#searchCloseButton').show()
                    $('#scroll-to-here')[0].scrollIntoView({behavior: 'smooth', block: 'start', inline: 'end'})
                })
            })
        }
        return ready
    }
    
    function resetDefaultStyle() {
        $('circle').attr('fill-opacity', 1)
        $('circle').attr('stroke-opacity', 1)
        $('text').attr('fill-opacity', 1)
        $('text').attr('stroke-opacity', 1)
        $('path').attr('stroke-opacity', 0.6)
        $('marker').attr('fill-opacity', 0.6)
    }

    function setFadedStyle() {
        $('circle').attr('fill-opacity', NONSELOPAC)
        $('circle').attr('stroke-opacity', NONSELOPAC)
        if (FADELABELS) {
            $('text').attr('fill-opacity', NONSELOPAC)
            $('text').attr('stroke-opacity', NONSELOPAC)
        }
        $('path').attr('stroke-opacity', NONSELOPAC)
        $('marker').attr('fill-opacity', NONSELOPAC)
    }

    function addFadingEffect_old() {
        $('circle').addClass('graph-component')
        $('text').addClass('graph-component')
        $('path').addClass('graph-component')
        $('marker').addClass('graph-component')
        
        var circles = document.getElementsByTagName('circle')
        var texts = document.getElementsByTagName('text')
        var paths = document.getElementsByTagName('path')
        var markers = document.getElementsByTagName('marker')
        var linkIndexDct = {}
        for (var j=0; j<paths.length; j++) {
            var p = paths[j]
            if ('__data__' in p)
                linkIndexDct[p.__data__.index] = p
        }
        
        for (var i=0; i<circles.length; i++) {
            (function () {
                var circle = circles[i]
                circle.addEventListener('mouseenter', (ev) => {
                    var neighbors = circle.__data__.allneighbors.split('---')
                    
                    for (var j=0; j<circles.length; j++) {
                        var c = circles[j]
                        if (!neighbors.includes(c.__data__.id)) {
                            c.classList.remove('shown-node')
                            c.classList.add('faded-node')
                        }
                    }
                    for (var j=0; j<texts.length; j++) {
                        var t = texts[j]
                        if (!neighbors.includes(t.__data__.id)) {
                            t.classList.remove('shown-node')
                            t.classList.add('faded-node')
                        }
                    }
                    for (var j=0; j<paths.length; j++) {
                        var p = paths[j]
                        if ('__data__' in p) {
                            if (!(neighbors.includes(p.__data__.source.id) && 
                                  neighbors.includes(p.__data__.target.id))) {
                                p.classList.remove('shown-path')
                                p.classList.add('faded-path')
                            }
                        }
                    }
                    for (var j=0; j<markers.length; j++) {
                        var m = markers[j]
                        var name = m.id
                        var dashLastIndex = name.lastIndexOf('-')
                        var index = name.slice(dashLastIndex + 1)
                        var p = linkIndexDct[index]
                        if (typeof p !== 'undefined' && '__data__' in p) {
                            if (!(neighbors.includes(p.__data__.source.id) && 
                                  neighbors.includes(p.__data__.target.id))) {
                                m.classList.remove('shown-marker')
                                m.classList.add('faded-marker')
                            }
                        }
                    }
                })
                circle.addEventListener('mouseleave', (ev) => {
                    $('circle').removeClass('faded-node')
                    $('text').removeClass('faded-node')
                    $('path').removeClass('faded-path')
                    $('marker').removeClass('faded-marker')
                    $('circle').addClass('shown-node')
                    $('text').addClass('shown-node')
                    $('path').addClass('shown-path')
                    $('marker').addClass('shown-marker')
                })
            }())
        }
    }

    function checkNodePosition() {
        var ready = $('circle').length > 0
        if (ready) {
            var prevPositions = {}
            var circles = $('circle')
            for (var i=0; i<circles.length; i++) {
                var circle = circles[i]
                var id = circle.__data__.id
                prevPositions[id] = {
                    x: circle.__data__.x,
                    y: circle.__data__.y,
                }
            }
            checkCirclePositions(prevPositions)
        }
        return ready
    }
    function checkCirclePositions(prevPositions) {
        setInterval(() => {
            var newPositions = {}
            var circles = $('circle')
            if (circles.length > 0) {
                for (var i=0; i<circles.length; i++) {
                    var circle = circles[i]
                    var id = circle.__data__.id
                    newPositions[id] = {
                        x: circle.__data__.x,
                        y: circle.__data__.y,
                    }
                }
                var samePositions = areSamePositions(prevPositions, newPositions)
                if (!samePositions)
                    prevPositions = newPositions
                var stopAnimation = samePositions && !ANIMATION_ARTIFICIALLY_PAUSED
//                ANIMATION_NATURALLY_STOPPED = nextState(ANIMATION_NATURALLY_STOPPED, stopAnimation)
//                if (ANIMATION_NATURALLY_STOPPED == 0) {
//                    console.log('Animation on / has never stopped')
//                }
//                else if (ANIMATION_NATURALLY_STOPPED == 1) {
//                    $('#pause').addClass('disabled')
//                    console.log('Animation off / has stopped')
//                }
//                else if (ANIMATION_NATURALLY_STOPPED == 2 && !ANIMATION_ARTIFICIALLY_PAUSED) {
//                    $('#pause').removeClass('disabled')
//                    console.log('Animation on / continues')
//                }
                ANIMATION_NATURALLY_STOPPED = stopAnimation
                if (ANIMATION_NATURALLY_STOPPED) {
                    //console.log('Animation off')
                    $('#pause').addClass('disabled')
                }
                else if (!ANIMATION_NATURALLY_STOPPED && !ANIMATION_ARTIFICIALLY_PAUSED) {
                    //console.log('Animation on')
                    $('#pause').removeClass('disabled')
                }
                else {
                    //console.log('Animation on')
                }
            }
        }, 2000)
    }
    function nextState(ans, stop) {
        var r
        if (false)
            r = null
        else if (ans == 0 && !stop)
            r = 0
        else if (ans == 0 && stop)
            r = 1
        else if (ans == 1 && !stop)
            r = 2
        else if (ans == 1 && stop)
            r = 1
        else if (ans == 2 && !stop)
            r = 2
        else if (ans == 2 && stop)
            r = 1
        else
            r = null
        return r
    }

    function addControlFuncionality() {
        var ready = $('.control-elem').length > 2
        if (ready) {
            $('#reload').click(function (ev) {
//                N_CLICKS++
                $('#play').addClass('disabled')
                $('#pause').addClass('disabled')
                loadEverything()
//                setTimeout(function() {
//                    if (N_CLICKS % 2 != 0)
//                        $('#reload')[0].click()
//                    else {
                        //nodeinfo()
                        //fadingeffect()
//                    }
//                }, 2000)
            })
            var netElem = $('.net-content svg')[0]
            $('#play').addClass('disabled')
            $('#play').click(function () {
                if (!$('#play').hasClass('disabled')) {
                    $('#play').addClass('disabled')
                    $('#pause').removeClass('disabled')
                    $('#controlAction').val('play')
                    netElem.dispatchEvent(new MouseEvent('dblclick'))
                    ANIMATION_ARTIFICIALLY_PAUSED = false
                }
            })
            $('#pause').removeClass('disabled')
            $('#pause').click(function () {
                if (!$('#pause').hasClass('disabled')) {
                    $('#play').removeClass('disabled')
                    $('#pause').addClass('disabled')
                    $('#controlAction').val('pause')
                    netElem.dispatchEvent(new MouseEvent('dblclick'))
                    ANIMATION_ARTIFICIALLY_PAUSED = true
                }
            })
            
            $( ".control" ).draggable({
                start: function( event, ui ) {
                    $(this).css({cursor: 'move'})
                },
                drag: function( event, ui ) {
                    $(this).css({cursor: 'move'})
                },
                stop: function( event, ui ) {
                    $(this).css({cursor: 'grab'})
                }
            })
        }
        return ready
    }

    function pauseSimulation() {
        var c1 = $('#net1').length > 0
        var c2 = $('#pause').length > 0
        var ready = c1 && c2
        if (ready) {
            // $('#pause').addClass('pause')
            //$('#pause').html('Pause')
            var elems = $('.net-content svg')
            var elem = elems[0]
            $('#pause').click(function () {
                // $('#pause').toggleClass('pause resume')
                elem.dispatchEvent(new MouseEvent('dblclick'))
                content = $('#pause').html() == 'Pause' ? 'Resume' : 'Pause'
                //$('#pause').html(content)
                ANIMATION_ARTIFICIALLY_PAUSED = content == 'Resume'
            })
//            $('#net1 svg')[0].addEventListener('mouseleave', (ev) => {
//                        //resetTimeout = setTimeout(() => {
//                            resetDefaultStyle()
//                        //}, 500)
//                    })
        }
        return ready
    }
});

function areSamePositions(a1, a2) {
    var r = true
    for (var i in a1)
        r = r && isSamePosition(a1[i], a2[i])
    return r
}
function isSamePosition(p1, p2) {
    return p1.x == p2.x && p1.y == p2.y
}

function formatList(lst) {
    if (lst.length == 0) {
        r = ''
    }
    else if (lst.length == 1) {
        r = '<i>' + lst[0] + '</i>'
    }
    else if (lst.length == 2) {
        r = '<i>' + lst[0] + '</i> and<br><i>' + lst[1] + '</i>'
    }
    else {
        r = ''
        for (var i=0; i<lst.length-2; i++) {
            r += '<i>' + lst[i] + '</i>,<br>'
        }
        r += '<i>' + lst[lst.length-2] + '</i>, and<br><i>' + lst[lst.length-1] + '</i>'
    }
    return r
}

document.body.onkeydown = function(ev) {
    // https://keycode.info/
    if (ev.keyCode == 83 && ev.ctrlKey) { // S
        ev.preventDefault()
        $('#searchCloseButton')[0].click()
        $('.optional').show()
    }
    else if (ev.keyCode == 72 && ev.ctrlKey) { // H
        ev.preventDefault()
        $('#searchCloseButton')[0].click()
        $('.optional').hide()
    }
    else if (ev.keyCode == 90 && ev.ctrlKey) { // Z
        ev.preventDefault()
        //$('#searchCloseButton')[0].click()
        //$('#searchBar').blur()
        // This is supposed to happen when focusing but it does not always
        $( "#sidebar .content" ).slideUp("slow", function() {
            $('#searchBar').css({'margin-top': '-10px'})
            $('#searchCloseButton').show()
            $('#scroll-to-here')[0].scrollIntoView({behavior: 'smooth', block: 'start', inline: 'end'})
            $('#searchInput').focus()
        })
    }
    //console.log(ev, String.fromCharCode(ev.keyCode)+" --> "+ev.keyCode);
};
