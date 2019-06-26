<template>
    <div class="f-editor" ref="editor"></div>
</template>

<script>
    import * as monaco from "monaco-editor";
    export default {
        props: ['value'],
        name: "editor",
        data() {
            return {
                val: this.value
            }
        },
        watch: {
            value() {
                this.$editor.getModel().setValue(this.value);
            }
        },
        methods: {
            render() {
                this.$editor = monaco.editor.create(this.$refs.editor, {
                    value: this.val,
                    language: "cpp",
                    theme: "vs-dark"
                });

                this.$editor.onDidChangeModelContent(event=> {
                    const code = this.$editor.getValue();
                    this.$emit('input', code);
                })
            },
            resize() {
                this.$editor.layout();
            }
        },
        mounted() {
            this.render();
            window.onresize = ()=> {
                this.$editor.layout();
            }
        }
    };
</script>

<style scoped lang="less">
    .f-editor {
        height: 100%;
    }
</style>
