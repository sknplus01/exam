/**
 * Created by Administrator on 2016/9/22.
 * 首页核心JS文件
 */
$(function () {
    //实现左侧导航动画效果
    $(".baseUI>li>a").off("click")
    $(".baseUI>li>a").on("click",function () {
        $(".baseUI>li>ul").slideUp();
        $(this).next().slideDown(300);
    });

    //默认收起全部，展示第一个
    $(".baseUI>li>ul").slideUp();
    $(".baseUI>li>a").eq(0).trigger("click");

    $(".baseUI>li>ul>li").on("click",function () {
        if(!$(this).hasClass("current")){
            $(".baseUI>li>ul>li").removeClass("current");
            $(this).addClass("current")
        }
    });
    //模拟点击
    $(".baseUI>li>ul>li>a").eq(0).trigger("click");
})

//核心模块
angular.module("app",["ng","ngRoute","app.subject","app.paper"])
    .controller("mainCtrl",["$scope",function ($scope) {

    }])
    //路由配置
    .config(["$routeProvider",function ($routeProvider) {
        $routeProvider.when("/AllSubject/a/:a/b/:b/c/:c/d/:d",{
            templateUrl:"tpl/subject/subjectList.html",
            controller:"subjectController"
        })/*.when("/SubjectManager",{
            templateUrl:"tpl/subject/subjectManger.html",
            controller:"subjectController"
        })*/.when("/addSubject",{
            templateUrl:"tpl/subject/addSubject.html",
            controller:"subjectController"
        }).when("/SubjectDel/id/:id",{
            templateUrl:"tpl/subject/subjectList.html",
            controller:"subjectDelController"
        }).when("/SubjectCheck/id/:id/state/:state",{
            templateUrl:"tpl/subject/subjectList.html",
            controller:"subjectCheckController"
        }).when("/PaperList",{
            templateUrl:"tpl/paper/paperManager.html",
            controller:"paperListController"
        }).when("/PaperAdd/id/:id/stem/:stem/type/:type/topic/:topic/level/:level",{
            templateUrl:"tpl/paper/paperAdd.html",
            controller:"paperAddController"
        }).when("/PaperSubjectList",{
            templateUrl:"tpl/paper/subjectList.html",
            controller:"subjectController"
        });
    }])