<script setup lang="ts">
const emit = defineEmits<{
  (e: "selectIcon", value: string): void;
}>();

const emojiList: string[] = [
  "&#128512", "&#128513", "&#128514", "&#128515", "&#128516", "&#128517", "&#128518", "&#128519",
  "&#128520", "&#128521", "&#128522", "&#128523", "&#128524", "&#128525", "&#128526", "&#128527",
  "&#128528", "&#128529", "&#128530", "&#128531", "&#128532", "&#128533", "&#128534", "&#128535",
  "&#128536", "&#128537", "&#128538", "&#128539", "&#128541", "&#128542", "&#128543", "&#128544",
  "&#128545", "&#128546", "&#128547", "&#128548", "&#128549", "&#128550", "&#128551", "&#128552",
  "&#128553", "&#128554", "&#128555", "&#128556", "&#128557", "&#128558", "&#128559", "&#128560",
  "&#128561", "&#128562", "&#128563", "&#128564", "&#128565", "&#128566", "&#128567", "&#128568",
  "&#128569", "&#128570", "&#128571", "&#128572", "&#128573", "&#128574", "&#128575", "&#128576",
  "&#128577", "&#128578", "&#128579", "&#128580", "&#128581", "&#128582", "&#128583", "&#128584",
  "&#128585", "&#128586", "&#128587", "&#128588", "&#128589", "&#128590", "&#128591", "&#129313",
  "&#129314", "&#129315", "&#129316", "&#129317", "&#129318", "&#129319", "&#129320", "&#129321",
  "&#129323", "&#129324", "&#129325", "&#129326", "&#129327", "&#129328", "&#129329", "&#129330",
  "&#129331", "&#129332", "&#129333"
];

const handleIcon = (item: string): void => {
  if (item) {
    emit("selectIcon", item);
  }
};
</script>

<template>
  <el-dropdown trigger="click" class="search-down" placement="bottom-start">
    <svg-icon name="smileFace" width="25px"></svg-icon>
    <template #dropdown>
      <div class="pop">
        <div class="icon-list">
          <div class="w-[30px] h-[30px] cursor-pointer" v-for="item in emojiList" :key="item">
            <div v-html="item" style="font-size: 2rem" @click="handleIcon(item)"></div>
          </div>
        </div>
      </div>
    </template>
  </el-dropdown>
</template>

<style lang="scss" scoped>
.pop {
  padding: 10px;
  overflow: auto;
}
.icon-list {
  width: 300px;
  min-height: 100px;
  max-height: 200px;
  display: grid;
  grid-template-columns: repeat(9, 30px);
  grid-auto-rows: 30px;
  gap: 3px;
}
</style>
