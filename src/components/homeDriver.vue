<template>
    <v-card class="rounded-b-circle text-center" color="deep-purple-darken-3" height="150">
      <v-container>
      <label for="toggle" class="toggle-label text-start mt-2">
          <input class="circle" id="toggle" name="toggle" type="checkbox" />
      </label>
    </v-container>
  </v-card>
</template>

<script>
</script>

<style scoped>
.toggle-label {
  width: 100px;
  height: 50px;
  cursor: pointer;
  display: inline-block;
  padding: 5px;
  background: #272727;
  border-radius: 50px;
  box-shadow: 0px 0px 16px -8px #fefefe;
  user-select: none;
}

.toggle-label::before,
.toggle-label::after {
  content: "offline";
  overflow: hidden;
  font-size: 40px;
  text-transform: uppercase;
  position: absolute;
  left: 50%;
  top: 70%;
  transition: 200ms;
  transform: translate(-50%, -50%);
  z-index: -10;
  font-family: sans-serif;
  font-weight: 300;
  color: transparent;
  -webkit-text-stroke-color: #ffffff;
  -webkit-text-stroke-width: 1px;
  transition: 700ms;
}

.toggle-label::after {
  content: "Online";
  transform: translate(0, 10%);
  left: -100%;
  transform: translate(0, -50%);
}

.toggle-label .circle {
  appearance: none;
  position: relative;
  width: 40px;
  height: 40px;
  background: #5e5e5e;
  border-radius: 50%;
  transition: all 0.5s cubic-bezier(1, 0, 0, 1);
  left: 0;
}

.toggle-label .circle:checked {
  background: #f43f5e;
  left: calc(100% - 40px);
}

.toggle-label .circle::before,
.toggle-label .circle::after {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: inline-block;
  width: 0;
  height: 0;
  border: 10px solid transparent;
  margin-left: 10px;
  border-left-color: #fefefe;
  z-index: 3;
  transition: 200ms;
}

.toggle-label:has(.circle:checked)::before {
  left: 100%;
  transform: translate(0, -50%);
}
.toggle-label:has(.circle:checked)::after {
  left: 50%;
  transform: translate(-50%, -50%);
}
.toggle-label .circle::after {
  border: none;
  margin-left: -5px;
  height: 18px;
  width: 3px;
  background-color: #fefefe;
  transition-delay: 150ms;
}

.toggle-label .circle::before {
  transition-delay: 50ms;
}

.toggle-label .circle:checked::before {
  opacity: 0;
}

.toggle-label .circle:checked::after {
  width: 20px;
  height: 20px;
  margin-left: 0px;
  border-radius: 5px;
}

</style>
