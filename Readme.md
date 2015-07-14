###任务要求
> 用javascript实现一个经典的“俄罗斯方块小游戏”<br>
> 要求：能计分，有不同关卡（速度不同），有高分榜,
> chrome 30+以上浏览器能正常玩，主流android，iphone手机能玩
###设计思路
- 方块有如下几种基本形状,分别对应代码里的七个数组：<br>
![](http://i.imgur.com/8jKx8tq.png)<br>
- 方块变换方式采用将每个方块的四种变换结果均预先存在数组，
例如：<br>[[0,0,0,1,1,1,2,1], [1,0,1,1,1,2,0,2], [0,0,1,0,2,0,2,1], [0,0,1,0,0,1,0,2]];即对应上述 形状1 的四种变换。<br>
- 每次移动方块，改变的均是（x, y）的值，然后以（x, y）为基坐标，绘制每个方块内部的小方块。下图对应上述数组的第一种变换。<br>
![](http://i.imgur.com/hfynVvk.png)
###任务进度：
- 用时约三天，前两天主要完成js部分，实现了基本游戏功能，移动端也做了简单的适配，接下来要就是添加css样式，以及一些页面动画。

（声明：方块变换方式有参考网上，但具体实现及全部代码均为自己所写，并没有UI designer，所以游戏界面如果不太美观的话，，，）
<p>在线演示： [http://husterxsp.sinaapp.com/tetris/](http://husterxsp.sinaapp.com/tetris/)