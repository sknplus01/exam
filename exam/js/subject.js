/**
 * Created by Administrator on 2016/9/22.
 * 这是一个题目管理的模块
 */
angular.module("app.subject",["ng","ngRoute"])
    .controller("subjectCheckController",["$routeParams","subjectService","$location",
        function ($routeParams,subjectService,$location) {
            subjectService.checkSubject($routeParams.id,$routeParams.state,function (data) {
                //发生跳转
                alert(data);
            })
            $location.path("/AllSubject/a/0/b/0/c/0/d/0");
    }])
    .controller("subjectDelController",["$routeParams","$scope","subjectService","$location",
        function ($routeParams,$scope,subjectService,$location) {
        var flag=confirm("确认删除吗？");
        if(flag){
            var id=$routeParams.id;
            subjectService.delSubject(id,function (data) {
                    alert(data);
            })
            $location.path("/AllSubject/a/0/b/0/c/0/d/0");
        }else{
            $location.path("/AllSubject/a/0/b/0/c/0/d/0");
        }
    }])
    .controller("subjectController",["$scope","commonService","subjectService",
       "$location", "$routeParams","$location",
        function ($scope,commonService,subjectService,$location,$routeParams,$location) {
            //将路由参数绑定在作用域中
            $scope.params=$routeParams;
            //console.log($scope.params);
            //添加页面绑定的对象
            $scope.subject={
                typeId:1,
                levelId:1,
                departmentId:1,
                topicId:1,
                stem:"",
                answer:"",//简答题答案
                fx:"",
                choiceContent:[],
                choiceCorrect:[false,false,false,false]
            }
       /* $scope.add=function () {
            $location.path("/addSubject")
        };*/
       //获取所有题目类型，题目难度，知识点，方向
        commonService.getAllTypes(function (data) {
            $scope.types=data;
        });
        commonService.getAllLevels(function (data) {
            $scope.levels=data;
        }) ;
       commonService.getAllDepartmentes(function (data) {
           $scope.departments=data;
       });
       commonService.getAllTopics(function (data) {
           $scope.topics=data
       });
    //保存并关闭
    $scope.submitAndClose=function () {
        subjectService.saveSubject( $scope.subject,function (data) {
            alert(data);
        })
        //跳转到列表页面
        $location.path("/AllSubject/a/0/b/0/c/0/d/0")
    }
    //保存
     $scope.submit=function () {
           subjectService.saveSubject( $scope.subject,function (data) {
               alert(data)
           })
         //重置作用域中绑定的表单默认值
         var subject={
             typeId:3,
             levelId:1,
             departmentId:1,
             topicId:1,
             stem:"",
             answer:"",//简答题答案
             fx:"",
             choiceContent:[],
             choiceCorrect:[]
         };
         angular.copy(subject,$scope.subject);
       }
       //获取所有的题目
     subjectService.getAllSubject($routeParams,function (data) {
         var answer=[];
         //为每个选项添加A B C D 选项
         data.forEach(function (subject) {
             if(subject.subjectType!=null){
             subject.choices.forEach(function (choice,index) {
                 choice.no=commonService.convertIndexToNo(index);
                 //console.log(choice.no);
             });
             //题目类型为单选或多项时，修改  subject answer
             if(subject.subjectType.id !=3){
                 subject.choices.forEach(function (choice) {
                     if(choice.correct){
                        answer.push(choice.no);
                     }
                 })
                 subject.answer=answer.toString();}
             }
             //修改当前题目的answer

         })
          $scope.subjects=data;
      })
    }])
    .service("subjectService",["$http","$httpParamSerializer",function ($http,$httpParamSerializer) {
        //审核题目
        this.checkSubject=function (id,state,handler) {
            $http.get("http://172.16.0.5:7777/test/exam/manager/checkSubject.action",{
                params:{
                    'subject.id':id,
                    'subject.checkState':state
                }
            }).success(function (data) {
                handler(data);
            })
        }
        //删除题目
        this.delSubject=function (id,handler) {
            $http.get("http://172.16.0.5:7777/test/exam/manager/delSubject.action",{
                params:{
                    'subject.id':id
                }
            }).success(function (data) {
                handler(data);
            })
        }

        //保存题目
        this.saveSubject=function (params,handler) {
            var obj={};
            for(var key in params){
                var val=params[key];
                switch (key){
                    case "typeId": obj["subject.subjectType.id"]=val;
                        break;
                    case "levelId":obj["subject.subjectLevel.id"]=val;
                        break;
                    case "departmentId":obj["subject.department.id"]=val;
                        break;
                    case "topicId":obj["subject.topic.id"]=val;
                        break;
                    case "stem":obj["subject.stem"]=val;
                        break;
                    case "answer":obj["subject.answer"]=val;
                        break;
                    case "fx":obj["subject.analysis"]=val;
                        break;
                    case "choiceContent":obj["choiceContent"]=val;
                        break;
                    case "choiceCorrect":obj["choiceCorrect"]=val;
                        break;
                }
            }
            //对obj对象进行表单格式的序列化操作（默认使用json格式）
            obj=$httpParamSerializer(obj);
            $http.post("http://172.16.0.5:7777/test/exam/manager/saveSubject.action",
                obj,{headers:{
                    "Content-Type":"application/x-www-form-urlencoded"
                }}).success(function (data) {
                handler(data);
            });
        };
        //获取所有题目信息
        this.getAllSubject=function (params,handler) {
            var data={};
            //循环将data转换为后台能够识别的筛选对象
            for(var key in params){
                var val=params[key];
                //只有当val不等于0的时候，才设置筛选属性
                if(val!=0){
                  switch(key){
                      case "a" : data['subject.subjectType.id']=val;
                          break;
                      case "b" : data['subject.subjectLevel.id']=val;
                          break;
                      case "c" : data['subject.department.id']=val;
                          break;
                      case "d" : data['subject.topic.id']=val;
                          break;
                  }
                }
            }
            console.log(data);
            // $http.get("data/subject.json")
          $http.get("http://172.16.0.5:7777/test/exam/manager/getAllSubjects.action",
              {
                params:data
              }
          ).success(function (data) {
                    handler(data);
                })
        }
    }])
    .factory("commonService",["$http",function ($http) {
        return{
            //为选项添加A B C D 标号
            convertIndexToNo:function (index) {
                switch (index){
                    case 0: return 'A';
                        break;
                    case 1: return'B';
                        break;
                    case 2: return 'C';
                        break;
                    case 3: return 'D';
                        break;
                }
            },
            getAllTypes:function (handler) {
                // $http.get("data/types.json")
               $http.get("http://172.16.0.5:7777/test/exam/manager/getAllSubjectType.action")
                    .success(function (data) {
                        handler(data);
                    });
            },
            getAllLevels:function (handler) {
                //$http.get("data/level.json")
               $http.get("http://172.16.0.5:7777/test/exam/manager/getAllSubjectLevel.action")
                    .success(function (data) {
                        handler(data);
                    });
            },
            getAllDepartmentes:function (handler) {
                // $http.get("data/departments.json")
                $http.get("http://172.16.0.5:7777/test/exam/manager/getAllDepartmentes.action")
                    .success(function (data) {
                        handler(data);
                    });
            },
            getAllTopics:function (handler) {
                // $http.get("data/Topics.json")
                $http.get("http://172.16.0.5:7777/test/exam/manager/getAllTopics.action")
                    .success(function (data) {
                        handler(data);
                    });
            },

        }
    }])

    .filter("selectTopics",function () {
        //input为要过滤的内容  id为方向id
        return function (input,id) {
            if(input){
                var result=input.filter(function (item) {
                    return item.department.id==id;
                })
            }
            //将过滤后的内容返回
            return result;
        }
    })
    .directive("selectOption",function () {
        return{
            restrict:"A",
            link:function (scope,element) {
               //console.log(element);
                element.on("change",function () {
                    var type=$(this).attr("type");
                    var val=$(this).val();
                    var isCheck = $(this).prop("checked");
                    //设置值
                    if(type=="radio"){
                        //重置
                        scope.subject.choiceCorrect=[false,false,false,false];
                        for(var i=0;i<4;i++){
                            if(i==val){
                                scope.subject.choiceCorrect[i]=true;
                            }
                        }
                    }else if(type=="checkbox"){
                        for(var i=0;i<4;i++){
                            if(i==val){
                                scope.subject.choiceCorrect[i]=true;
                            }
                        }
                    }
                    //强制消化
                    scope.$digest();
                })
            }
        }
    })
    /*.config(["$routeProvider",
        function ($routeProvider) {
        $routeProvider.when("/addSubject",{
            templateUrl:"tpl/subject/addSubject.html",
            controller:"addSubjectController"
    })}])*/


