<template>
    <div class="message">
        <div class="message-icon">
            <slot name="icon"/>
        </div>
        <div class="message-body">
            <slot/>
        </div>
        <!--<button class="message-close">-->
            <!--<CloseIcon/>-->
        <!--</button>-->
    </div>
</template>
<style scoped lang="scss">
    .message {
        background-color: #1976d2;
        width: 400px;
        display: flex;

        .message-icon {
            background-color: rgba(0,0,0,0.25);
            width: 80px;
            display: flex;
            align-items: center;

            svg {
                height: 32px;
                fill: white;
            }
        }

        .message-body {
            color: white;
            padding: 16px;
        }
    }
</style>
<script>
    import CloseIcon from '../../../images/arrows/cancel.svg'

    export default {
      name: 'Notification',
      components: {
        CloseIcon
      }
    }
</script>