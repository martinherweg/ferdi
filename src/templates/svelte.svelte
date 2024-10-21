<script lang="ts">
  import { tv, type VariantProps } from "tailwind-variants";

  const tv{{filename}} = tv({
    base: "",
  });

  type {{filename}}Props = {
    compName?: string;
    className?: string;
    prop: any;
  } & VariantProps<typeof tv{{filename}}>;

  let {
    compName = "{{filename}}",
    className,
    prop,
    ...rest
  }: {{filename}}Props = $props();
</script>

{#if prop}
  <div data-comp={compName} {...rest}>{prop}</div>
{/if}
