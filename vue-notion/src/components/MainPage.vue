<template>
  <div class="main-page">
    <div class="left-menu" @click.self="onEditNoteEnd()">

      <!-- ノートリスト -->
      <!-- $event"ないとmutation errorに-->
      <!-- 出来た瞬間、layerは１に-->
      <NoteItem
        v-for="note in noteList"
        v-bind:note="note"
        v-bind:layer = "1"
        v-bind:key="note.id"
        @mouseover="note.mouseover = $event"
        @delete="onDeleteNote"
        @editStart="onEditNoteStart"
        @editEnd="onEditNoteEnd"
        @input="note.name = $event"
        @addChild="onAddChildNote"
        @addNoteAfter="onAddNoteAfter"
      />

      <!-- ノート追加ボタン -->
      <button class="transparent" @click="onClickButtonAdd">
        <i class="fas fa-plus-square"></i>ノートを追加a
      </button>
        
    </div>
    <div class="right-view" @click.self="onEditNoteEnd()">
      右ビュー
    </div>
  </div>
</template>

<script>
  import NoteItem from '@/components/parts/NoteItem.vue'

export default {
  data(){
    return{
      noteList : [],
    }
  },
  methods: {
    onAddNoteCommon : function(targetList, layer, index) {//新規ノートの作成
      //子供が増える = layerが増える。onAddChildNote
      //兄弟が増える = targetListの箱（要素数）が増える。→
      //onAddNoteAfter。中身は[parentNote.children]。なので親がいないときは0。いると１が入る。でもなぜlengthは＋１か
      layer = layer || 1; //当てはまる方が入る？
      const note = {
        id : new Date().getTime().toString(16),
        name : `新規ノート-${layer}-${targetList.length}`,
        mouseover : false,
        editing : false,
        children : [],
        layer : layer,
      };
      if (index == null) {
        targetList.push(note);
      } else {
        targetList.splice(index + 1, 0, note);//※(1) 変化位置・削除数・"追加"するもの
      }
    },
    onClickButtonAdd : function(){
      this.onAddNoteCommon(this.noteList);
    },
    onDeleteNote : function(parentNote, note) {
      const targetList = parentNote == null ? this.noteList : parentNote.children;
      const index = targetList.indexOf(note);
      targetList.splice(index, 1);
    },
    onEditNoteStart : function(editNote, parentNote) {
      const targetList = parentNote == null ? this.noteList : parentNote.children;
      for (let note of targetList) {
        note.editing = (note.id === editNote.id);
        this.onEditNoteStart(editNote, note);
      }
    },
    onEditNoteEnd : function(parentNote) {
      const targetList = parentNote == null ? this.noteList : parentNote.children;
      for (let note of targetList) {
        note.editing = false;
        this.onEditNoteEnd(note);
      }
    },
    onAddChildNote : function(note) {
      this.onAddNoteCommon(note.children, note.layer + 1);//子供のノートを作るときに数が足される
    },
    onAddNoteAfter : function(parentNote, note) {
      const targetList = parentNote == null ? this.noteList : parentNote.children;
      const layer = parentNote == null ? 1 : note.layer;//1か何番目の子供か
      const index = targetList.indexOf(note);////何番目の要素の番号か、特定して格納
      this.onAddNoteCommon(targetList, layer, index);
      console.log(targetList);
      console.log(targetList.length);
    },
  },
  components: {
    NoteItem,
  },
}
</script>

<style scoped lang="scss">
.main-page {
  display:flex;
  height:calc(100vh - 60px);
  .left-menu {
    width: 350px;
    background-color: #f7f6f3;
  }
  .right-view {
    flex-grow: 1;
    padding: 10px;
  }
}
</style>
