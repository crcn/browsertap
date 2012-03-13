package mx.filters
{
    import flash.filters.BitmapFilter;
    
   /**
    *  Interface used by some Spark filters.
    * 
    *  @langversion 3.0
    *  @playerversion Flash 10
    *  @playerversion AIR 1.5
    *  @productversion Flex 4
    */
    public interface IBitmapFilter
    {
        function clone():BitmapFilter;
    }
}
