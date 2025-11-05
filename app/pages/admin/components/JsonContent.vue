<template>
  <div class="json-content max-h-[80vh] overflow-auto">
    <div class="content-head">
      <p class="text-2xl" v-if="selectedFile">{{ selectedFile.name }} 内容</p>
      <button v-if="selectedFile" @click="saveFile" class="save-btn">保存</button>
    </div>

    <div v-if="selectedFile">
      <MySelect
        v-model="selected"
        :options="[
          { label: 'vue-json-pretty', value: 1 },
          { label: 'JsonEditorVue', value: 2 },
        ]"
        placeholder="请选择"
        :darkMode="darkMode"
        size="small"
      />
    </div>

    <div>
      <vue-json-pretty
        v-if="selectedFile && selected === 1"
        :deep="3"
        selectableType="single"
        editableTrigger="dblclick"
        :showSelectController="false"
        :highlightMouseoverNode="true"
        path="res"
        v-model:data="selectedFile.content"
        :showLength="true"
        :showIcon="true"
        :editable="true"
        :showLineNumber="true"
        :theme="darkMode ? 'dark' : 'light'"
      >
        <template #value="{ value, editing, updateValue }">
          <textarea
            v-if="editing"
            :value="value"
            @input="updateValue($event.target.value)"
            style="
              width: 100%;
              min-height: 30px;
              padding: 3px 8px;
              box-sizing: border-box;
            "
          ></textarea>
          <span v-else>{{ value }}</span>
        </template>
      </vue-json-pretty>

      <JsonEditorVue
        v-if="selectedFile && selected === 2"
        v-model="selectedFile.content"
        :mode="'tree'"
        :search="true"
        :indentation="2"
        :history="true"
        :theme="darkMode ? 'dark' : 'light'"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import VueJsonPretty from "vue-json-pretty";
import "vue-json-pretty/lib/styles.css";
import JsonEditorVue from "json-editor-vue";

defineProps<{
  selectedFile: { name: string; content: any } | null;
  darkMode: boolean;
}>();

const emit = defineEmits<{
  (e: "saveFile"): void;
}>();

const selected = ref(1);

const saveFile = () => {
  emit("saveFile");
};
</script>

<style scoped>
.json-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.save-btn {
  padding: 0.3rem 1.5rem;
  border-radius: 3px;
  border: none;
  background-color: #10b981;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s;
  width: max-content;
}
.save-btn:hover {
  background-color: #059669;
}
.content-head {
  display: flex;
  justify-content: space-between;
}
</style>
