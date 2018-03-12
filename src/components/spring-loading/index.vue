<template lang="jade">
  div.loading-screen
    div.loading-container
        div.lantern.l2 0%
        div.lantern.l1
            span.fu 福
</template>

<style type="text/css">
  .loading-screen {
    position:fixed;
    top:0;
    width:100%;
    height:100%;
    z-index:1000;
    background:#fff;
    font-family:Arial;
    font-weight:bold;
    transform-origin:100% 0;
  }

  .loading-screen .loading-container {
    position:fixed;
    width:260px;
    height:260px;
    top:50%;
    left:50%;
    margin-left:-130px;
    margin-top:-170px;
    z-index:1001;
    background:#fff;
    overflow:hidden;
    border-radius:50%;
    animation:jump 2.4s ease infinite
  }

  .loading-screen .lantern{
    position:absolute;
    left:50%;
    top:50%;
    margin-top:-80px;
    margin-left:-80px;
    width:160px;
    height:160px;
    animation:rotatelantern 2.4s ease infinite;
    color:#fff;
    text-align:center;
    line-height:172px;
  }

  .loading-screen .lantern.l1 {
    font-size:100px
  }

  .loading-screen .lantern.l2 {
    backface-visibility:hidden;
    font-size:52px;
    z-index:1
  }

  .loading-screen .lantern:after{
    position:absolute;
    top:0;
    display:block;
    content:'';
    width:100%;
    height:100%;
    background:#db4527;
    transform:rotate(45deg);
    z-index:-1
  }

  .loading-screen .lantern .fu {
    display:inline-block;
    font-weight:bold;
    font-family:'Microsoft YaHei',Arial,Helvetica,sans-serif;
    transform:rotateX(180deg)
  }

  @-moz-keyframes rotatelantern {
    0% {
      transform:rotateY(0)
    }
    100% {
      transform:rotateY(360deg)
    }
  }

  @-webkit-keyframes rotatelantern {
    0% {
      transform:rotateY(0)
    }

    100% {
      transform:rotateY(360deg)
      }
    }

  @-o-keyframes rotatelantern {
    0% {
      transform:rotateY(0)
    }
    100% {
      transform:rotateY(360deg)
      }
    }

  @keyframes rotatelantern {
    0% {
      transform:rotateY(0)
    }
    100% {
      transform:rotateY(360deg)
    }
  }
  @-moz-keyframes jump {
    0% {
      transform:translateY(50px)
    }
    40% {
      transform:translateY(0)
    }
    100% {
      transform:translateY(50px)
    }
  }

  @-webkit-keyframes jump {
    0% {
      transform:translateY(50px)
    }
    40% {
      transform:translateY(0)
    }
    100% {
      transform:translateY(50px)
    }
  }

  @-o-keyframes jump {
    0% {
      transform:translateY(50px)
    }
    40% {
      transform:translateY(0)
    }
    100% {
      transform:translateY(50px)
    }
  }

  @keyframes jump {
    0% {
      transform:translateY(50px)
    }
    40% {
      transform:translateY(0)
    }
    100% {
      transform:translateY(50px)
    }
  }
</style>
