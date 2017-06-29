var trackArray = ["가상현실","인공지능","응용SW","HCI&VC","멀티미디어" ,"사물인터넷",
"시스템응용", "지능형인지", "데이터사이언스", "정보보호"];
var trackCount = function(){
  var trackCnt = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ];
  $.ajax({
    type: "GET",
    url: "http://52.14.97.63:3000/api/student/"+$('#menu-logo').data("user")+"/lectures",
    contentType: "application/x-www-form-urlencoded; charset=UTF-8",
    cache: false,
    datatype: "json", // expecting JSON to be returned
    success: function(result) {

    },
    error: function(error) {
      console.log('track 데이터 가져오기 실패')
    }
  }).done(function(result){
    //console.log(result)
    for (var i = 0; i < result.length; i++) {
      //console.log(result[i].lecture_id)
      $.ajax({
        type: "GET",
        url: "/api/lecture/"+result[i].lecture_id+"/track",
        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
        cache: false,
        datatype: "json", // expecting JSON to be returned
        success: function(result) {

        },
        error: function(error) {
          console.log('track 데이터 가져오기 실패')
        }
      }).done(function(result){
        //console.log(result)
        for (var i = 0; i < result.length; i++) {
          //console.log(result[i].track_id)
          var index = result[i].track_id;
          trackCnt[index-1] = trackCnt[index-1]+1;
        }

      })
    }
  })
}
var diagram2 = function(){
  function init() {
    var $ = go.GraphObject.make;  // for conciseness in defining templates in this function

    myDiagram =
      $(go.Diagram, "myDiagramDiv",  // must be the ID or reference to div
        { initialContentAlignment: go.Spot.Center });

    // define all of the gradient brushes
    var graygrad = $(go.Brush, "Linear", { 0: "#F5F5F5", 1: "#F1F1F1" });
    var bluegrad = $(go.Brush, "Linear", { 0: "#CDDAF0", 1: "#91ADDD" });
    var yellowgrad = $(go.Brush, "Linear", { 0: "#FEC901", 1: "#FEA200" });
    var lavgrad = $(go.Brush, "Linear", { 0: "#EF9EFA", 1: "#A570AD" });

    // define the Node template for non-terminal nodes
    myDiagram.nodeTemplate =
      $(go.Node, "Auto",
        { isShadowed: true },
        // define the node's outer shape
        $(go.Shape, "RoundedRectangle",
          { fill: graygrad, stroke: "#D8D8D8" },
          new go.Binding("fill", "color")),
        // define the node's text
        $(go.TextBlock,
          { margin: 5, font: "bold 11px Helvetica, bold Arial, sans-serif" },
          new go.Binding("text", "key"))
      );

    // define the Link template
    myDiagram.linkTemplate =
      $(go.Link,  // the whole link panel
        { selectable: false },
        $(go.Shape));  // the link shape

    // create the model for the double tree
    myDiagram.model = new go.TreeModel([
        // these node data are indented but not nested according to the depth in the tree
        { key: "Root", color: lavgrad },
          { key: "Left1", parent: "Root", dir: "left"},
            { key: "leaf1", parent: "Left1" },
            { key: "leaf2", parent: "Left1" },
            { key: "Left2", parent: "Left1" },
              { key: "leaf3", parent: "Left2" },
              { key: "leaf4", parent: "Left2" },
          { key: "Right1", parent: "Root", dir: "right"},
            { key: "Right2", parent: "Right1"},
              { key: "leaf5", parent: "Right2" },
              { key: "leaf6", parent: "Right2" },
              { key: "leaf7", parent: "Right2" },
            { key: "leaf8", parent: "Right1" },
            { key: "leaf9", parent: "Right1" }
      ]);

    doubleTreeLayout(myDiagram);
  }

  function doubleTreeLayout(diagram) {
    // Within this function override the definition of '$' from jQuery:
    var $ = go.GraphObject.make;  // for conciseness in defining templates
    diagram.startTransaction("Double Tree Layout");

    // split the nodes and links into two Sets, depending on direction
    var leftParts = new go.Set(go.Part);
    var rightParts = new go.Set(go.Part);
    separatePartsByLayout(diagram, leftParts, rightParts);
    // but the ROOT node will be in both collections

    // create and perform two TreeLayouts, one in each direction,
    // without moving the ROOT node, on the different subsets of nodes and links
    var layout1 =
      $(go.TreeLayout,
        { angle: 180,
          arrangement: go.TreeLayout.ArrangementFixedRoots,
          setsPortSpot: false });

    var layout2 =
      $(go.TreeLayout,
        { angle: 0,
          arrangement: go.TreeLayout.ArrangementFixedRoots,
          setsPortSpot: false });

    layout1.doLayout(leftParts);
    layout2.doLayout(rightParts);

    diagram.commitTransaction("Double Tree Layout");
  }

  function separatePartsByLayout(diagram, leftParts, rightParts) {
    var root = diagram.findNodeForKey("Root");
    if (root === null) return;
    // the ROOT node is shared by both subtrees!
    leftParts.add(root);
    rightParts.add(root);
    // look at all of the immediate children of the ROOT node
    root.findTreeChildrenNodes().each(function(child) {
        // in what direction is this child growing?
        var dir = child.data.dir;
        var coll = (dir === "left") ? leftParts : rightParts;
        // add the whole subtree starting with this child node
        coll.addAll(child.findTreeParts());
        // and also add the link from the ROOT node to this child node
        coll.add(child.findTreeParentLink());
      });
  }
  init()
}
/*
var diagram = function(nodeDataArray, linkDataArray, diagram_id) {
  function onSelectionChanged(node) {
    console.log("dd")
  }
  var HORIZONTAL = true;
  var $ = go.GraphObject.make;
  var diagram = $(go.Diagram, diagram_id, {
    initialContentAlignment: go.Spot.Center,
    layout: $(go.GridLayout,
                    { comparer: go.GridLayout.smartComparer })
    //contentAlignment: go.Spot.Center,
    //initialDocumentSpot: go.Spot.Center,
    //initialViewportSpot: go.Spot.Center
  });

  diagram.nodeTemplate =
    $(go.Node, "Auto", {
        click: onSelectionChanged
      }, // executed when Part.isSelected has changed
      $(go.Shape, {
          figure: "RoundedRectangle",
          fill: "white"
        }, // default Shape.fill value
        new go.Binding("fill", "color")), // binding to get fill from nodedata.color
      $(go.TextBlock, {
          margin: 5
        },
        new go.Binding("text", "key")), // binding to get TextBlock.text from nodedata.key

    );
  diagram.model = new go.GraphLinksModel(nodeDataArray, linkDataArray);
}
*/
function loadScript(url, callback) {
  var script = document.createElement('script');
  script.src = url;
  script.onload = callback;
  document.getElementsByTagName('head')[0].appendChild(script);
}
// 선택한 트랙의 flowchart와 progress바 로딩
var trackLoad = function(track_id, track_name) {
  var header = '<div class="fourteen wide column"><h1 class="header" >' + track_name + '</h1></div>';
  //var subHeader = '<div class="sub header" >dsds</div>'
  $('.main-right').empty();
  //$('.main-right').width($(window).width()-240);
  $('.main-right').append('<div class="ui grid"></div>')
  $('.main-right .grid').append(header);

  $('.main-right .grid').append('<div class="two wide column empty_heartIcon" data-id="' + track_id + '" data-name="' + track_name + '" ><i class="empty big heart icon"></i></div>');
  //$('.main-right .header').append(subHeader);
  $('.main-right').append('<div class="ui two item menu"><a class="item flowchart" data-id="' + track_id + '" data-name="' + track_name + '">FlowChart</a><a class="item progressMenu" data-id="' + track_id + '" data-name="' + track_name + '">Progress</a></div>');
  $('.main-right').append('<div class="trackContent "><img class="ui image trackImage" src="images/track' + (track_id - 1) + '.png"></div>');
  //$('.main-right').append('<div id="diagram_'+track_id+'" style="width:100%; height:600px;"></div>')
}
var progressLoad = function() {
  $('.trackContent').empty();
  $('.trackContent').append('<div class="ui progress" data-percent="74" id="example6"><div class="bar"><div class="progress"></div></div><div class="label">Track 이수도</div></div>');
  var myloaded = function() {
    $('#example6').progress();
  }
  loadScript('semantic/dist/semantic.min.js', myloaded);
}
var getFavorTrack = function(){
  $.ajax({
    type: "GET",
    url: "http://52.14.97.63:3000/api/student/"+$('#menu-logo').data("user")+"/favorTracks",
    contentType: "application/x-www-form-urlencoded; charset=UTF-8",
    cache: false,
    datatype: "json", // expecting JSON to be returned
    success: function(result) {
      //console.log(result)
      for (var i = 0; i < result.length; i++) {
        //console.log(result[i].track_id);
        var appendItem = '<a class="item track_menu_item" data-id="' + result[i].track_id + '" data-name="' + trackArray[(result[i].track_id)-1] + '">' + trackArray[(result[i].track_id)-1] + '</a>';
        $('#favorTracks').append(appendItem)
      }
    },
    error: function(error) {
      console.log('track 데이터 가져오기 실패')
    }
  });
}
$(document).ready(function() {
  $('.main-right').width($(window).width() - 240);
  // 모든 트랙을 가져와 메뉴로 바인딩
  var getAllTrack = function() {
    $.ajax({
      type: "GET",
      url: "http://52.14.97.63:3000/api/tracks",
      contentType: "application/x-www-form-urlencoded; charset=UTF-8",
      cache: false,
      datatype: "json", // expecting JSON to be returned
      success: function(result) {
        for (var i = 0; i < result.length; i++) {
          var appendItem = '<a class="item track_menu_item" data-id="' + result[i].track_id + '" data-name="' + result[i].track_name + '">' + result[i].track_name + '</a>';
          $('#all-tracks').append(appendItem)
        }
      },
      error: function(error) {
        console.log('track 데이터 가져오기 실패')
      }
    });

  };

  getAllTrack();
  getFavorTrack();
  //diagram2()
  $(window).resize(function() {
    $('.main-right').width($(window).width() - 240);
  });
});
$(document).ajaxComplete(function(event, xhr, settings) {
  var track_1 = [
    //{ key: "Alpha", color: "lightblue" },
    //{ key: "Beta",color: "pink" },
    { key: "멀티미디어 프로그래밍"},
    { key: "멀티미디어" },
    { key: "컴퓨터그래픽스" },
    { key: "게임프로그래밍"  },
  ];
  var trackLink_1 = [
    { from: "멀티미디어 프로그래밍", to: "컴퓨터그래픽스" },
    { from: "멀티미디어", to: "컴퓨터그래픽스" },

  ];
  $('.track_menu_item').live('click', function() {
    var track_id = $(this).data("id");
    var track_name = $(this).data("name");

    // 선택한 트랙의 flowchart와 progress바 로딩
    trackLoad(track_id, track_name);
    //diagram(track_1, trackLink_1, 'diagram_'+track_id);
  });
  $('.progressMenu').live('click', function() {
    var track_id = $('.progressMenu').data("id");
    var track_name = $('.progressMenu').data("name");
    progressLoad();
  });
  $('.flowchart').live('click', function() {
    var track_id = $('.flowchart').data("id");
    var track_name = $('.flowchart').data("name");
    trackLoad(track_id, track_name);
  });
  $('.empty_heartIcon').live('click', function() {
    var track_id = $(this).data("id");
    var track_name = $(this).data("name");
    console.log(track_id)
    $(this).empty();
    $(this).removeClass('empty_heartIcon');
    $(this).addClass('heartIcon')
    $(this).append('<i class="heart big icon"></i>')
    var data = {
      'id': track_id,
      'name': track_name
    }
    $.ajax({
      type: "POST",
      url: "/favorite",
      contentType: "application/x-www-form-urlencoded; charset=UTF-8",
      cache: false,
      datatype: "json", // expecting JSON to be returned
      data: data,
      success: function(result) {
        //getFavorTrack();

        if(result =='success'){
            console.log('favorite 성공');
        }else{
            console.log('favorite 실패');
        }
      },
      error: function(error) {
        //alert('로그인 실패!');
      }
    })
  });
  $('.heartIcon').live('click', function() {
    var track_id = $(this).data("id");
    var track_name = $(this).data("name");
    console.log(track_id)
    $(this).empty();
    $(this).removeClass('heartIcon');
    $(this).addClass('empty_heartIcon')
    $(this).append('<i class="empty heart big icon"></i>')
    var data = {
      'id': track_id,
      'name': track_name
    }
    $.ajax({
      type: "POST",
      url: "/unfavorite",
      contentType: "application/x-www-form-urlencoded; charset=UTF-8",
      cache: false,
      datatype: "json", // expecting JSON to be returned
      data: data,
      success: function(result) {
        //getFavorTrack();
        if(result =='success'){
            console.log('favorite 성공');
        }else{
            console.log('favorite 실패');
        }
      },
      error: function(error) {
        //alert('로그인 실패!');
      }
    })
  });
  $('#trackStatus').live('click', function() {
    console.log(123)
    trackCount();
    $('.main-right').empty();
    $('.main-right').append('<canvas id="myChart" width="600" height="500"></canvas>');
    var ctx = $("#myChart");
    data= [{
        x: 10,
        y: 20
    }, {
        x: 15,
        y: 10
    }]
    console.log(data)

    var myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: trackArray,
        datasets: [{
            label: '트랙 이수 현황',
            data: [1, 3, 6, 5, 2, 3, 6, 1, 8, 3],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)',
                'rgba(113, 113, 113, 0.2)',
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)'
            ],
            borderColor: [
                'rgba(255,99,132,1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)',
                'rgba(113, 113, 113, 1)',
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero:true
                }
            }]
        }
    }
    });
  });
  $('#makecurr').live('click', function() {
    var user_id = $('#menu-logo').data("user")
    $('.main-right').empty();
    $('.main-right').append('<div class="ui horizontal segments simul"></div>');
    $('.main-right .segments').append('<div class="ui loading segment" id="finishedMajor"></div>');
    $('.main-right .segments').append('<div class="ui loading segment" id = "checkMajor"></div>');
    $('#checkMajor').append('<h2>수강 희망 강좌</h2>');
    $('#finishedMajor').append('<h2>수강 완료 강의</h2>')
    $('#checkMajor').append('<div class="grouped fields"></div>')
    $('#finishedMajor').append('<div class="grouped fields"></div>')
    $('.main-right').append('<button class="fluid ui button">시뮬레이션 시작</button>')
    $.ajax({
      type: "GET",
      url: "/api/lectures",
      contentType: "application/x-www-form-urlencoded; charset=UTF-8",
      cache: false,
      datatype: "json", // expecting JSON to be returned
      success: function(result) {

      },
      error: function(error) {
        console.log('lecture 데이터 가져오기 실패')
      }
    }).done(function(result) {
      $('#checkMajor').removeClass('loading');
      for (var i = 0; i < result.length; i++) {
        $('#checkMajor .fields').append('<div class="field checkField"><div class="ui checkbox"><input type="checkbox" name="example"><label>'+result[i].lecture_name+'</label></div></div>')
      }
    });
    var url = '/api/student/'+user_id+'/lectures';
    console.log(url);
    $.ajax({
      type: "GET",
      url: url,
      contentType: "application/x-www-form-urlencoded; charset=UTF-8",
      cache: false,
      datatype: "json", // expecting JSON to be returned
      success: function(result) {

      },
      error: function(error) {
        console.log('lecture 데이터 가져오기 실패')
      }
    }).done(function(result) {
      $('#finishedMajor').removeClass('loading');
      for (var i = 0; i < result.length; i++) {
        $('#finishedMajor .fields').append('<div class="field checkField"><label>'+result[i].lecture_name+'</label></div>')
      }
    });

  });
  $('#profile').live('click', function(){
    $('.main-right').empty();
    $('.main-right').append('<div class="ui card" id="user-card"></div>');
    $('.main-right .card').append('<div class="image"></div><div class="content"></div>');
    $('.main-right .card .image').append('<img src="/images/girl.png">');
    $('.main-right .card .content').append('<a class="header">'+$('#menu-logo').data("name")+'</a>');

  });
});
