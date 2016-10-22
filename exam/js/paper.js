/**
 * Created by Administrator on 2016/9/28.
 * 试卷模块
 */
//ng为核心angular模块
angular.module("app.paper",["ng","app.subject"])
    //试卷查询控制器
    .controller("paperListController",["$scope",function ($scope) {

    }])
    //试卷添加控制器
    .controller("paperAddController",["$scope","commonService","$routeParams","paperModel","paperService",
        function ($scope,commonService,$routeParams,paperModel,paperService) {
            commonService.getAllDepartmentes(function (data) {
                //将全部方向绑定到作用域的dps
                $scope.dps=data;
            })
            //单例
            $scope.pmodel=paperModel.model;
            var subjectID=$routeParams.id;
            if(subjectID!= 0){
                paperModel.addSubjectId(subjectID);
                paperModel.addSubjects(angular.copy($routeParams));
            }
            console.log($scope.pmodel)
           $scope.save=function () {
               paperService.savePaper($scope.pmodel,function (data) {
                   alert(data);
               })
           }
    }])
    .factory("paperModel",[
        function () {
            return{
                model:{
                    departmentId:1,     //方向id
                    title:"",           //试卷标题
                    desc:"",            //试卷描述
                    at:0,                //答题时间
                    total:0,             //总分
                    scores:[],            //每个题目的分值
                    subjectIds:[],        //每个题目的id
                    subjects:[]
                },
                addSubjectId:function (id) {
                    this.model.subjectIds.push(id);
                },
                addSubjects:function (subject) {
                    this.model.subjects.push(subject)
                }
            }
    }])
    .factory("paperService",["$http","$httpParamSerializer",
        function ($http,$httpParamSerializer) {
        return{
            savePaper:function (param,handler) {
            var obj={};
                for(var key in param){
                   var val=param[key];
                    switch(key){
                        case "departmentId":obj['paper.department.id']=val;
                            break;
                        case "title": obj['paper.title']=val;
                            break;
                        case "desc":obj['paper.description']=val;
                            break;
                        case "at":obj['paper.answerQuestionTime']=val;
                            break;
                        case "total":obj['paper.totalPoints']=val;
                            break;
                        case "scores":obj['scores']=val;
                            break;
                        case "subjectIds":obj['subjectIds']=val;
                            break;
                    }
                }

                obj=$httpParamSerializer(obj);
                $http.post("http://172.16.0.5:7777/test/exam/manager/saveExamPaper.action",
                obj,{headers:{
                    "Content-Type":"application/x-www-form-urlencoded"
                }}).success(function (data) {
                handler(data);
                });
            }
        }
    }])
    //试卷删除控制器
    .controller("paperListController",["$scope",function ($scope) {

    }])