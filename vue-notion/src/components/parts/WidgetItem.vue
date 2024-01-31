<template>
    <div class="widget-family">
      <div class="widget"
        @mouseover="onMouseOver"
        @mouseleave="onMouseLeave"
        v-bind:class="{mouseover: widget.mouseover}"
      >
      <!-- ノートリスト widgetを受け取ってないので出てこない問題-
        v-modelを使わずに@inuputで子供からupdateをかけられるようにする-->
      <template v-if="widget.type == 'heading'">
        <input
          :value="widget.text" @input="$emit('update:widget.text', $event.target.value)"
          class="heading transparent"
          placeholder="見出し"
        />
      </template>
      <template v-if="widget.type == 'body'">
        ・<input
            :value="widget.text" @input="$emit('update:widget.text', $event.target.value)"
            class="body transparent"
            placeholder="本文"
          />
      </template>
      <template v-if="widget.type == 'code'">
        <textarea
            :value="widget.text" @input="$emit('update:widget.text', $event.target.value)"
            class="code"
            rows="1"
            placeholder="コード"
            v-bind:ref="'widget-code-' + widget.id"
            
        >
        </textarea>
      </template>
        
        
        
        <div v-show="widget.mouseover" class="buttons">
          <div class="button-icon" v-if="layer < 3" @click="onClickChildWidget(widget)">
            <i class="fas fa-sitemap"></i>
          </div>
          <div class="button-icon" @click="onClickAddWidgetAfter(parentWidget, widget)">
            <i class="fas fa-plus-circle"></i>
          </div>
          <div class="button-icon" @click="onClickDelete(parentWidget, widget)">
            <i class="fas fa-trash"></i>
          </div>
          <div class="button-icon">
            <i class="fas fa-cog" data-toggle="dropdown"></i>
            <div class="dropdown-menu">
                
                <a class="dropdown-item" @click="changeHeading">見出し</a>
                <a class="dropdown-item"  @click="changeBody" >本文</a>
                <a class="dropdown-item" @click="changeCode" >ソースコード</a>
                <!-- 
                <a class="dropdown-item" @click="$emit('update:widget.type', 'heading')">見出し</a>
                <a class="dropdown-item"  @click="$emit('update:widget.type', body)" >本文</a>
                <a class="dropdown-item" @click="$emit('update:widget.type', 'code')" >ソースコード</a>
                <a class="dropdown-item" @click="widget.type = 'heading'">見出し</a>
                <a class="dropdown-item" @click="widget.type = 'body'" >本文</a>
                <a class="dropdown-item" @click="widget.type = 'code'" >ソースコード</a> -->
            </div>
          </div>
        </div>
      </div>
      <div class="child-widget">
        <WidgetItem
          v-for="childWidget in widget.children"
          v-bind:widget="childWidget"
          v-bind:parentWidget="widget"
          v-bind:layer="layer + 1"
          v-bind:key="childWidget.id"
          @mouseover="childWidget.mouseover = $event"
          @type="childWidget.type = $event"
          @input="childWidget.text = $event"
          @delete="onClickDelete"
          @addChild="onClickChildWidget"
          @addWidgetAfter="onClickAddWidgetAfter"
        />
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'WidgetItem',
    props: [
      'widget',
      'parentWidget',
      'layer',
    ],
    methods: {
      onMouseOver : function() {
        // this.widget.mouseover = true;
        this.$emit('mouseover', true);//回避 アイコンの表示制御
      },
      onMouseLeave : function() {
        // this.widget.mouseover = false;
        this.$emit('mouseover', false);//回避
      },
      onClickDelete : function(parentWidget, widget) {
        this.$emit('delete', parentWidget, widget);
      },
      onClickChildWidget : function(widget) {
        this.$emit('addChild', widget);
      },
      onClickAddWidgetAfter : function(parentWidget, widget) {
        this.$emit('addWidgetAfter', parentWidget, widget);
      },
    //   resizeCodeTextarea : function() {
        // console.log('aaaa');
        // if (this.widget.type !== 'code') return;
        // if(this.textarea !== null){
        //↑この条件式でないとif文がエラー。でもtextareaが空の場合はif文で割けないと結局undifinedエラー
            // const textarea = this.$refs[`widget-code-${this.widget.id}`];
            // console.log(textarea);
            // const promise = new Promise(function() {
            // textarea.style.height = 'auto';
            // :style=""
            // console.log(promise);
    //         });
    //    },

        // promise = new Promise(function(resolve) {
        //     resolve(textarea.style.height = 'auto')
        //     console.log(promise);
        // });

        // promise.then(function(){
        //     textarea.style.height = textarea.scrollHeight + 'px'
        //     console.log('bbbb');
        // });

      changeHeading : function(){
        this.$emit('type', 'heading');
        // this.$emit('text', text);
      },
      changeBody : function(){
        this.$emit('type', 'body');
      },
      changeCode : function(){
        this.$emit('type', 'code');
      },



    },
    watch: {
        'widget.text': function() {
            // this.resizeCodeTextarea();
            console.log("watchきてます");
        },
    },
    
  }
  </script>
  
  <style scoped lang="scss">
  .widget {
    width: 100%;
    min-height: 40px;
    display: flex;
    align-items: center;
    padding: 5px 10px;
    color: rgba(25, 23, 17, 0.6);
    .buttons {
      display: flex;
      flex-direction: row;
      cursor: pointer;
      .button-icon {
        padding: 3px;
        margin-left: 3px;
        border-radius: 5px;
      }
    }
    input.heading {
    font-size: 20px;
    font-weight: bold;
    border-bottom: 1.5px solid #e0e0e0;
    }
    input.body {
        font-size: 16px;
    }
    .code {
        width: calc(100% - 120px);
        height: 35px;
        padding: 5px 10px;
        border: none;
        border-radius: 8px;
        color: #f8f8f2;
        background: #282a36;
        font-size: 14px;
        font-family: Consolas, Menlo, 'Liberation Mono', Courier, monospace;
        resize: none;
    }
    .code:focus {
        outline: none;
        -webkit-box-shadow: none;
        box-shadow: none;
    }
  }

  .child-widget {
    padding-left: 10px;
  }
  </style>
  
  