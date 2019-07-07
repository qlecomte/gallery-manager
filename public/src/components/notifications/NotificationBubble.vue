<template>
    <div class="bubble">
        <BellIcon class="icon"/>
    </div>
</template>
<style scoped lang="scss">
    .bubble {
        height: 60px;
        width: 60px;
        border-radius: 30px;
        background-color: dodgerblue;
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;

        .icon {
            fill: white;
            width: 30px;
            height: 30px;

        }
    }
</style>
<script>
  import BellIcon from '../../../images/notification.svg'

  export default {
    name: 'NotificationBubble',
    components: {
      BellIcon
    }
  }
</script>