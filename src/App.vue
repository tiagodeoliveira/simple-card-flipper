<template>
  <w-app>
    <w-flex justify-center class="pa3">
      <div class="box">
        <w-card shadow>
          <vue-flip active-click :width="flipWidth" height="300px" v-model="flipped">
            <template v-slot:front>
              <w-card class="ccard" title="Original" bg-color="brown-light5" color="black" no-border>
                {{ currentOriginal }}
              </w-card>
            </template>
            <template v-slot:back>
              <w-card class="ccard" title="Translation" bg-color="blue-light1" color="white" no-border>
                {{ currentTranslation }}
              </w-card>
            </template>
          </vue-flip>

          <template #actions>
            <w-flex wrap class="text-center">
              <div class="xs4 pa1">
                <a class="edit" v-on:click="shuffle" title="Shuffle">
                  <w-icon class="mr1" lg color="primary">
                    fa fa-random
                  </w-icon>
                </a>
              </div>
              <div class="xs4 pa1">
                <a class="edit" v-on:click="previous">
                  <w-icon class="mr1" xs color="grey">
                    fa fa-arrow-left
                  </w-icon>
                </a>

                {{ currentIndex + 1 }} / {{items.length}}

                <a class="edit" v-on:click="next">
                  <w-icon class="mr1" xs color="grey">
                    fa fa-arrow-right
                  </w-icon>
                </a>

              </div>
              <div class="xs4 pa1">
                <a class="edit" v-on:click="dialog.show = true" title="Edit">
                  <w-icon class="mr1" lg color="primary">
                    fa fa-pencil
                  </w-icon>
                </a>
              </div>
            </w-flex>
          </template>
        </w-card>
      </div>
    </w-flex>

    <w-dialog
      v-model="dialog.show"
      title="Edit content"
      persistent
      :width="700"
    >
      <w-textarea outline ref="userContent" :model-value="content"></w-textarea>
      <template #actions>
        <div class="spacer" />
        <w-button class="mr2" @click="dialog.show = false" bg-color="error">
          Cancel
        </w-button>
        <w-button @click="save" bg-color="success">
          Save
        </w-button>
      </template>
    </w-dialog>
  </w-app>
</template>

<script>
import VueFlip from "vue-flip";

const prepareItems = (content) => {
  if (!content) {
    return [];
  }
  return content
    .trim()
    .replace(/(^[ \t]*\n)/gm, "")
    .split(/\r?\n/)
    .map((i) => i.split("="))
    .map((j) => ({ original: j[0], translation: j[1] }));
};

export default {
  name: "App",
  components: {
    "vue-flip": VueFlip,
  },
  data: () => ({
    dialog: { show: false },
    content: "",
    items: [],
    currentIndex: 0,
    flipped: false,
  }),
  computed: {
    currentTranslation() {
      return (this.items[this.currentIndex] || {}).translation;
    },
    currentOriginal() {
      return (this.items[this.currentIndex] || {}).original;
    },
    flipWidth() {
      const size = Math.min(window.innerWidth - 30, 500);
      return `${size}px`;
    },
  },
  mounted() {
    this.content = localStorage.getItem("content");
    this.items = prepareItems(this.content);
    window.addEventListener("keydown", this.listenKey);
  },
  methods: {
    save() {
      this.dialog.show = false;
      this.content = this.$refs.userContent.inputValue;
      localStorage.setItem("content", this.content);
      this.items = prepareItems(this.content);
    },
    shuffle() {
      this.flipped = false;
      const min = 0;
      const max = this.items.length;
      if (max > 1) {
        let index = this.currentIndex;
        while (index === this.currentIndex) {
          index = Math.floor(Math.random() * (max - min) + min);
        }
        setTimeout(() => this.currentIndex = index, 400);
      }
    },
    previous() {
      this.flipped = false;
      const max = this.items.length - 1;
      let newIndex = this.currentIndex - 1;
      if (newIndex < 0) {
        newIndex = max;
      }
      setTimeout(() => this.currentIndex = newIndex, 400);
    },
    next() {
      this.flipped = false;
      const max = this.items.length - 1;
      let newIndex = this.currentIndex + 1;
      if (newIndex > max) {
        newIndex = 0;
      }
      setTimeout(() => this.currentIndex = newIndex, 400);
    },
    listenKey(key) {
      if (this.dialog.show === true) {
        return;
      }
      switch (key.keyCode) {
        case 70:
          this.flipped = !this.flipped;
          break;
        case 32:
          this.shuffle();
          break;
        case 39:
          this.next();
          break;
        case 37:
          this.previous();
          break;
        case 69:
          this.dialog.show = true;
          break;
      }
    }
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.front {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}
.back {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.ccard {
  width: 100%;
  height: 100%;
}

.w-card__content {
  font-size: 1.5em;
  display: flex;
  align-items: center;
  justify-content: center;
}

.w-card__title {
  font-size: 1.0em !important;
}

.edit {
  cursor: pointer;
}

</style>
