/**********************************************************************
 * 
 *  Toby Opferman
 *
 *  Example GDI DDI (Device Driver Interface) Driver Entry Point
 *
 *  This example is for educational purposes only.  I license this source
 *  out for use in learning how to write a device driver.
 *
 *  Copyright (c) 2005, All Rights Reserved  
 **********************************************************************/

#define __NTDDKCOMP__        
#define _MPPC_
#define _WIN32_WINNT 0x500


#include <stddef.h>
#include <stdarg.h>
#include <limits.h>
#include <windef.h>
#include <wingdi.h>
#include <math.h>
#include <winddi.h>
#include <devioctl.h>

#include <ntddvdeo.h>


#include "gdifuncs.h"

#define RESOLUTION_X      4000
#define RESOLUTION_Y      4000
#define COLOR_DEPTH_BYTES 4
#define COLOR_DEPTH_BITS  32




#define SYSTM_LOGFONT {16,7,0,0,700,0,0,0,ANSI_CHARSET,OUT_DEFAULT_PRECIS,CLIP_DEFAULT_PRECIS,DEFAULT_QUALITY,VARIABLE_PITCH | FF_DONTCARE,L"System"}
#define HELVE_LOGFONT {12,9,0,0,400,0,0,0,ANSI_CHARSET,OUT_DEFAULT_PRECIS,CLIP_STROKE_PRECIS,PROOF_QUALITY,VARIABLE_PITCH | FF_DONTCARE,L"MS Sans Serif"}
#define COURI_LOGFONT {12,9,0,0,400,0,0,0,ANSI_CHARSET,OUT_DEFAULT_PRECIS,CLIP_STROKE_PRECIS,PROOF_QUALITY,FIXED_PITCH | FF_DONTCARE, L"Courier"}


const DEVINFO gDevInfoFrameBuffer = {
    ( GCAPS_OPAQUERECT  |
     /* GCAPS_LAYERED     |    If you do not really support this you can have big problems */
      GCAPS_DITHERONREALIZE  |
      GCAPS_ALTERNATEFILL    |
      GCAPS_WINDINGFILL      |
      GCAPS_MONO_DITHER      |
      GCAPS_GRAY16           |
      GCAPS_COLOR_DITHER
                   ), /* Graphics capabilities         */
    SYSTM_LOGFONT,    /* Default font description */
    HELVE_LOGFONT,    /* ANSI variable font description   */
    COURI_LOGFONT,    /* ANSI fixed font description          */
    0,                /* Count of device fonts          */
    0,                /* Preferred DIB format          */
    8,                /* Width of color dither          */
    8,                /* Height of color dither   */
    0,                  /* Default palette to use for this device */
    GCAPS2_SYNCTIMER |
    GCAPS2_SYNCFLUSH
};


//#define ENGDEBUGPRINT
#define ENGDEBUGPRINT EngDebugPrint

 
/*********************************************************************
 * GdiExample_DrvEnablePDEV
 *
 *   This function will provide a description of the Physical Device.  The data
 *   returned is a user defined data context to be used as a handle for this
 *   display device.
 *
 *   The hDriver is a handle to the miniport driver associated with this display
 *   device.  This handle can be used to communicate to the miniport through APIs
 *   to send things like IOCTLs.
 *
 *********************************************************************/
DHPDEV GdiExample_DrvEnablePDEV(DEVMODEW *pdm, PWSTR pwszLogAddr, ULONG cPat, HSURF *phsurfPatterns, ULONG cjCaps, GDIINFO *pGdiInfo, ULONG cjDevInfo, DEVINFO *pDevInfo, HDEV hdev, PWSTR pwszDeviceName, HANDLE hDriver) 
{
    PDEVICE_DATA pDeviceData = NULL;
    
    ENGDEBUGPRINT(0, "GdiExample_DrvEnablePDEV Enter \r\n", NULL);

    pDeviceData = (PDEVICE_DATA) EngAllocMem(0, sizeof(DEVICE_DATA), FAKE_GFX_TAG);

    if(pDeviceData)
    {
        memset(pDeviceData, 0, sizeof(DEVICE_DATA));
        memset(pGdiInfo, 0, cjCaps);
        memset(pDevInfo, 0, cjDevInfo);

        {
            pGdiInfo->ulVersion    = 0x5000;
            pGdiInfo->ulTechnology = DT_RASDISPLAY;
            pGdiInfo->ulHorzSize   = 0;
            pGdiInfo->ulVertSize   = 0;
            pGdiInfo->ulHorzRes        = RESOLUTION_X;
            pGdiInfo->ulVertRes        = RESOLUTION_Y;
            pGdiInfo->ulPanningHorzRes = 0;
            pGdiInfo->ulPanningVertRes = 0;
            pGdiInfo->cBitsPixel       = 8;
            pGdiInfo->cPlanes          = 4;
            pGdiInfo->ulNumColors      = 20;
            pGdiInfo->ulVRefresh       = 1;       
            pGdiInfo->ulBltAlignment   = 1;     
            pGdiInfo->ulLogPixelsX = 96;
            pGdiInfo->ulLogPixelsY = 96;
            pGdiInfo->flTextCaps   = TC_RA_ABLE;
            pGdiInfo->flRaster     = 0;
            pGdiInfo->ulDACRed     = 8;
            pGdiInfo->ulDACGreen   = 8;
            pGdiInfo->ulDACBlue    = 8;
            pGdiInfo->ulAspectX    = 0x24; 
            pGdiInfo->ulNumPalReg  = 256;
            pGdiInfo->ulAspectY    = 0x24;
            pGdiInfo->ulAspectXY   = 0x33;
            pGdiInfo->xStyleStep   = 1;       
            pGdiInfo->yStyleStep   = 1;
            pGdiInfo->denStyleStep = 3;
            pGdiInfo->ptlPhysOffset.x = 0;
            pGdiInfo->ptlPhysOffset.y = 0;
            pGdiInfo->szlPhysSize.cx  = 0;
            pGdiInfo->szlPhysSize.cy  = 0;
            pGdiInfo->ciDevice.Red.x = 6700;
            pGdiInfo->ciDevice.Red.y = 3300;
            pGdiInfo->ciDevice.Red.Y = 0;
            pGdiInfo->ciDevice.Green.x = 2100;
            pGdiInfo->ciDevice.Green.y = 7100;
            pGdiInfo->ciDevice.Green.Y = 0;
            pGdiInfo->ciDevice.Blue.x = 1400;
            pGdiInfo->ciDevice.Blue.y = 800;
            pGdiInfo->ciDevice.Blue.Y = 0;
            pGdiInfo->ciDevice.AlignmentWhite.x = 3127;
            pGdiInfo->ciDevice.AlignmentWhite.y = 3290;
            pGdiInfo->ciDevice.AlignmentWhite.Y = 0;
            pGdiInfo->ciDevice.RedGamma = 20000;
            pGdiInfo->ciDevice.GreenGamma = 20000;
            pGdiInfo->ciDevice.BlueGamma = 20000;
            pGdiInfo->ciDevice.Cyan.x = 1750;
            pGdiInfo->ciDevice.Cyan.y = 3950;
            pGdiInfo->ciDevice.Cyan.Y = 0;
            pGdiInfo->ciDevice.Magenta.x = 4050;
            pGdiInfo->ciDevice.Magenta.y = 2050;
            pGdiInfo->ciDevice.Magenta.Y = 0;
            pGdiInfo->ciDevice.Yellow.x = 4400;
            pGdiInfo->ciDevice.Yellow.y = 5200;
            pGdiInfo->ciDevice.Yellow.Y = 0;
            pGdiInfo->ciDevice.MagentaInCyanDye = 0;
            pGdiInfo->ciDevice.YellowInCyanDye = 0;
            pGdiInfo->ciDevice.CyanInMagentaDye = 0;
            pGdiInfo->ciDevice.YellowInMagentaDye = 0;
            pGdiInfo->ciDevice.CyanInYellowDye = 0;
            pGdiInfo->ciDevice.MagentaInYellowDye = 0;
            pGdiInfo->ulDevicePelsDPI = 0; 
            pGdiInfo->ulPrimaryOrder = PRIMARY_ORDER_CBA;
            pGdiInfo->ulHTPatternSize = HT_PATSIZE_4x4_M;
            pGdiInfo->flHTFlags = HT_FLAG_ADDITIVE_PRIMS;
            pGdiInfo->ulHTOutputFormat = HT_FORMAT_32BPP;

            
            *pDevInfo = gDevInfoFrameBuffer;
            pDevInfo->iDitherFormat = BMF_32BPP;

        }

        pDeviceData->pVideoMemory = EngMapFile(L"\\??\\c:\\video.dat", RESOLUTION_X*RESOLUTION_Y*4, &pDeviceData->pMappedFile);

        pDeviceData->hDriver = hDriver;
        pDevInfo->hpalDefault = EngCreatePalette(PAL_BITFIELDS, 0, NULL, 0xFF0000, 0xFF00, 0xFF);
    }

    ENGDEBUGPRINT(0, "GdiExample_DrvEnablePDEV Exit \r\n", NULL);

    return (DHPDEV)pDeviceData;
}

/*********************************************************************
 * GdiExample_DrvCompletePDEV
 *
 *   This is called to complete the process of enabling the device.
 *   
 *
 *********************************************************************/
void GdiExample_DrvCompletePDEV(DHPDEV  dhpdev, HDEV  hdev)
{
    PDEVICE_DATA pDeviceData = (PDEVICE_DATA)dhpdev;
    ENGDEBUGPRINT(0, "GdiExample_DrvCompletePDEV Enter \r\n", NULL);

    pDeviceData->hdev = hdev;

    ENGDEBUGPRINT(0, "GdiExample_DrvCompletePDEV Exit \r\n", NULL);
}


/*********************************************************************
 * GdiExample_DrvAssertMode
 *
 *    This API sets the display mode of the device to the original mode
 *    which was used during initialization or the default mode of the hardware.
 *
 *********************************************************************/
BOOL GdiExample_DrvAssertMode(DHPDEV  dhpdev,BOOL  bEnable)
{

    ENGDEBUGPRINT(0, "GdiExample_DrvAssertMode\r\n", NULL);

    /*
     * We do nothing here
     */
    return TRUE;
}

/*********************************************************************
 * GdiExample_DrvDisablePDEV
 *
 *   This is called to disable the PDEV we created.
 *   
 *
 *********************************************************************/
void GdiExample_DrvDisablePDEV(DHPDEV  dhpdev)
{
    PDEVICE_DATA pDeviceData = (PDEVICE_DATA)dhpdev;
    UINT dwBytesReturned = 0;

    ENGDEBUGPRINT(0, "GdiExample_DrvDisablePDEV\r\n", NULL);

    if(pDeviceData->pMappedFile)
    {
       EngUnmapFile(pDeviceData->pMappedFile);
    }

    EngFreeMem(dhpdev);
}


/*********************************************************************
 * GdiExample_DrvEscape
 *
 *    This is the equivlent of an "IOCTL" for a display driver but instead
 *    of an "IOCTL" you have "ESCAPE CODES".  This is how you can communicate
 *    to this display driver in a device DEPENDENT manner instead of INDEPENDENT.
 *
 *    To call into this interface from user mode you use the "ExtEscape" API.
 *
 *********************************************************************/
ULONG GdiExample_DrvEscape(SURFOBJ *pso, ULONG iEsc, ULONG  cjIn, PVOID  pvIn, ULONG cjOut, PVOID pvOut)
{
    ENGDEBUGPRINT(0, "GdiExample_DrvEscape\r\n", NULL);
    return 0;
}



/*********************************************************************
 * GdiExample_DrvGetModes
 *
 *    This API is used to enumerate display modes.
 *
 *    This driver only supports 800x600x32
 *
 *********************************************************************/
ULONG GdiExample_DrvGetModes(HANDLE hDriver, ULONG cjSize, DEVMODEW *pdm)
{
   ULONG ulBytesWritten = 0, ulBytesNeeded = sizeof(DEVMODEW);
   ULONG ulReturnValue;
   ENGDEBUGPRINT(0, "GdiExample_DrvGetModes\r\n", NULL);
   if(pdm == NULL)
   {
       ulReturnValue =  ulBytesNeeded;
   }
   else
   {
       

       ulBytesWritten = sizeof(DEVMODEW);

       memset(pdm, 0, sizeof(DEVMODEW));
       memcpy(pdm->dmDeviceName, DLL_NAME, sizeof(DLL_NAME));

       pdm->dmSpecVersion   = DM_SPECVERSION;
       pdm->dmDriverVersion = DM_SPECVERSION;

       pdm->dmDriverExtra      = 0;
       pdm->dmSize             = sizeof(DEVMODEW);
       pdm->dmBitsPerPel       = 32;
       pdm->dmPelsWidth        = RESOLUTION_X;
       pdm->dmPelsHeight       = RESOLUTION_Y;
       pdm->dmDisplayFrequency = 75;

       pdm->dmDisplayFlags     = 0;
       
       pdm->dmPanningWidth     = pdm->dmPelsWidth;
       pdm->dmPanningHeight    = pdm->dmPelsHeight;

       pdm->dmFields           = DM_BITSPERPEL | DM_PELSWIDTH | DM_PELSHEIGHT | DM_DISPLAYFLAGS | DM_DISPLAYFREQUENCY;

       ulReturnValue = ulBytesWritten;

   }

   return ulReturnValue;
}


/*********************************************************************
 * GdiExample_DrvResetPDEV
 *
 *    This API is used to pass state information from one PDEV
 *    instance to another.
 *
 *********************************************************************/
BOOL GdiExample_DrvResetPDEV(DHPDEV  dhpdevOld, DHPDEV  dhpdevNew)
{
    ENGDEBUGPRINT(0, "GdiExample_DrvResetPDEV\r\n", NULL);

    return FALSE;
}




/*********************************************************************
 * GdiExample_DrvEnableSurface
 *
 *  This API is used to enable the physical device surface.  
 *
 *  You have two choices here.
 *     
 *     1. Driver Manages it's own surface
 *          EngCreateDeviceSurface - Create the handle
 *          EngModifySurface - Let GDI Know about the object.
 *
 *     2. GDI Manages the surface
 *          EngCreateBitmap - Create a handle in a format that GDI Understands
 *          EngAssociateSurface - Let GDI Know about the object.
 *
 *
 *********************************************************************/
HSURF GdiExample_DrvEnableSurface(DHPDEV  dhpdev)
{
    
    SIZEL       sizl;
    PDEVICE_DATA pDeviceData = (PDEVICE_DATA)dhpdev;
    
    ENGDEBUGPRINT(0, "GdiExample_DrvEnableSurface\r\n", NULL);

    pDeviceData->pDeviceSurface = (PDEVICE_SURFACE)EngAllocMem(FL_ZERO_MEMORY, sizeof(DEVICE_SURFACE), FAKE_GFX_TAG);

    sizl.cx = RESOLUTION_X;
    sizl.cy = RESOLUTION_Y;

    pDeviceData->hsurf = (HSURF)EngCreateDeviceSurface((DHSURF)pDeviceData->pDeviceSurface, sizl, BMF_32BPP);
    
    EngModifySurface(pDeviceData->hsurf, pDeviceData->hdev, HOOK_FILLPATH | HOOK_STROKEPATH | HOOK_LINETO | HOOK_TEXTOUT | HOOK_BITBLT | HOOK_COPYBITS, 0, (DHSURF)pDeviceData->pDeviceSurface, pDeviceData->pVideoMemory, RESOLUTION_X*4, NULL);
    
    return(pDeviceData->hsurf);

}


/*********************************************************************
 * GdiExample_DrvDisableSurface
 *
 *  This API is called to disable the GDI Surface.
 *
 *
 *********************************************************************/

void GdiExample_DrvDisableSurface(DHPDEV  dhpdev)
{
    PDEVICE_DATA pDeviceData = (PDEVICE_DATA)dhpdev;

    ENGDEBUGPRINT(0, "GdiExample_DrvDisableSurface\r\n", NULL);

    EngDeleteSurface(pDeviceData->hsurf);
    pDeviceData->hsurf = NULL;

    EngFreeMem(pDeviceData->pDeviceSurface);
    pDeviceData->pDeviceSurface = NULL;
}



/*********************************************************************
 * GdiExample_DrvMovePointer
 *
 *    This API is used to move the Mouse Pointer
 *
 *********************************************************************/
void GdiExample_DrvMovePointer(SURFOBJ  *pso, LONG  x, LONG  y, RECTL  *prcl)
{
    ENGDEBUGPRINT(0, "GdiExample_DrvMovePointer\r\n", NULL);

    if(pso)
    {
       EngMovePointer(pso, x, y, prcl);
    }

}

/*********************************************************************
 * GdiExample_DrvSetPointerShape
 *
 *    This API is used to set the Mouse Pointer shape
 *
 *********************************************************************/
ULONG GdiExample_DrvSetPointerShape(SURFOBJ  *pso, SURFOBJ  *psoMask, SURFOBJ  *psoColor, XLATEOBJ  *pxlo, LONG  xHot, LONG  yHot, LONG  x, LONG  y, RECTL  *prcl, FLONG  fl)
{
    ENGDEBUGPRINT(0, "GdiExample_DrvSetPointerShape\r\n", NULL);

    return SPS_ACCEPT_NOEXCLUDE;
}


/*********************************************************************
 * GdiExample_DrvNotify
 *
 *    This API is optional. GDI will call it to "notify" the driver of certain operations.
 *
 *********************************************************************/
void GdiExample_DrvNotify(SURFOBJ  *pso, ULONG  iType, PVOID  pvData)
{
    ENGDEBUGPRINT(0, "GdiExample_DrvNotify\r\n", NULL);
     /* Do Nothing */
}

/*********************************************************************
 * GdiExample_DrvRealizeBrush
 *
 *    Realizes a brush
 *
 *********************************************************************/
BOOL GdiExample_DrvRealizeBrush(BRUSHOBJ  *pbo, SURFOBJ  *psoTarget, SURFOBJ  *psoPattern, SURFOBJ  *psoMask, XLATEOBJ  *pxlo, ULONG  iHatch)
{
    ENGDEBUGPRINT(0, "GdiExample_DrvRealizeBrush\r\n", NULL);
    
    return TRUE;
}
          
/*********************************************************************
 * GdiExample_DrvSetPalette
 *
 *    Sets the palette for palette modes.  We don't support this.
 *
 *********************************************************************/
BOOL GdiExample_DrvSetPalette(DHPDEV  dhpdev, PALOBJ  *ppalo, FLONG  fl, ULONG  iStart, ULONG  cColors)
{
    ENGDEBUGPRINT(0, "GdiExample_DrvSetPalette\r\n", NULL);
    return FALSE;
}
            

/*********************************************************************
 * GdiExample_DrvStretchBlt
 *
 *   Performs a stretch Blt
 *
 *********************************************************************/       
BOOL GdiExample_DrvStretchBlt(SURFOBJ  *psoDest, SURFOBJ  *psoSrc, SURFOBJ  *psoMask, CLIPOBJ  *pco, XLATEOBJ  *pxlo, COLORADJUSTMENT  *pca, POINTL  *pptlHTOrg, RECTL  *prclDest, RECTL  *prclSrc, POINTL  *pptlMask, ULONG  iMode)
{
    ENGDEBUGPRINT(0, "GdiExample_DrvStretchBlt\r\n", NULL);
    return EngStretchBlt(psoDest, psoSrc, psoMask, pco, pxlo, pca, pptlHTOrg, prclDest, prclSrc, pptlMask, iMode);
}



/*********************************************************************
 * GdiExample_DrvSynchronizeSurface
 *
 *   Helps synchronize GDI writes with the co-processor.  This is optional.
 *
 *********************************************************************/ 
void GdiExample_DrvSynchronizeSurface(SURFOBJ  *pso, RECTL  *prcl, FLONG  fl)
{
    ENGDEBUGPRINT(0, "GdiExample_DrvSynchronizeSurface\r\n", NULL);
    /* Do Nothing */
}
    

/*********************************************************************
 * GdiExample_DrvAlphaBlend
 *
 *   Performs alpha blending.
 *
 *********************************************************************/
BOOL GdiExample_DrvAlphaBlend(SURFOBJ  *psoDest, SURFOBJ  *psoSrc, CLIPOBJ  *pco, XLATEOBJ  *pxlo, RECTL  *prclDest, RECTL  *prclSrc, BLENDOBJ  *pBlendObj)
{
    ENGDEBUGPRINT(0, "GdiExample_DrvAlphaBlend\r\n", NULL);

    return EngAlphaBlend(psoDest, psoSrc, pco, pxlo, prclDest, prclSrc, pBlendObj);
}


/*********************************************************************
 * GdiExample_DrvSaveScreenBits
 *
 *    This API is used to save parts of the screen when they are being overlapped.
 *    We return 0 to let GDI handle this
 *
 *********************************************************************/
ULONG_PTR GdiExample_DrvSaveScreenBits(SURFOBJ  *pso, ULONG  iMode, ULONG_PTR  ident, RECTL  *prcl)
{
    ENGDEBUGPRINT(0, "GdiExample_DrvSaveScreenBits\r\n", NULL);

    return 0;
}

/*********************************************************************
 * GdiExample_DrvBitBlt
 *
 *    This API is used to perform a BitBlt operation
 *
 *********************************************************************/
BOOL GdiExample_DrvBitBlt(SURFOBJ  *psoTrg, SURFOBJ  *psoSrc, SURFOBJ  *psoMask, CLIPOBJ  *pco, XLATEOBJ  *pxlo, RECTL  *prclTrg, POINTL  *pptlSrc, POINTL  *pptlMask, BRUSHOBJ  *pbo, POINTL  *pptlBrush, ROP4  rop4)
{
    ENGDEBUGPRINT(0, "GdiExample_DrvBitBlt\r\n", NULL);

    return EngBitBlt(psoTrg, psoSrc, psoMask, pco, pxlo, prclTrg, pptlSrc, pptlMask, pbo, pptlBrush, rop4);
}
                

/*********************************************************************
 * GdiExample_DrvCopyBits
 *
 *    This API copies between different formats.
 *
 *********************************************************************/
BOOL GdiExample_DrvCopyBits(SURFOBJ  *psoDest, SURFOBJ  *psoSrc, CLIPOBJ  *pco, XLATEOBJ  *pxlo, RECTL  *prclDest, POINTL  *pptlSrc)
{
    ENGDEBUGPRINT(0, "GdiExample_DrvCopyBits\r\n", NULL);

   // return EngCopyBits(psoDest, psoSrc, pco, pxlo, prclDest, pptlSrc);
    return GdiExample_DrvBitBlt(psoDest, psoSrc, NULL, pco, pxlo, prclDest, pptlSrc, NULL, NULL, NULL, ROP4_SRCCOPY);
}

/*********************************************************************
 * GdiExample_DrvFillPath
 *
 *    This API fills the path.
 *
 *********************************************************************/

BOOL GdiExample_DrvFillPath(SURFOBJ  *pso, PATHOBJ  *ppo, CLIPOBJ  *pco, BRUSHOBJ  *pbo, POINTL  *pptlBrushOrg, MIX  mix, FLONG  flOptions)
{
    ENGDEBUGPRINT(0, "GdiExample_DrvFillPath\r\n", NULL);

    return EngFillPath(pso, ppo,pco, pbo, pptlBrushOrg, mix, flOptions);
}
              
/*********************************************************************
 * GdiExample_DrvGradientFill
 *
 *    This API does a gradient fill.
 *
 *********************************************************************/
BOOL GdiExample_DrvGradientFill(SURFOBJ  *psoDest, CLIPOBJ  *pco, XLATEOBJ  *pxlo, TRIVERTEX  *pVertex, ULONG  nVertex, PVOID  pMesh, ULONG  nMesh, RECTL  *prclExtents, POINTL  *pptlDitherOrg, ULONG  ulMode)          
{
    ENGDEBUGPRINT(0, "GdiExample_DrvGradientFill\r\n", NULL);
    return EngGradientFill(psoDest, pco, pxlo, pVertex, nVertex, pMesh, nMesh, prclExtents, pptlDitherOrg, ulMode);
}


/*********************************************************************
 * GdiExample_DrvLineTo
 *
 *    This API implements a LINE TO operation.
 *
 *********************************************************************/
BOOL GdiExample_DrvLineTo(SURFOBJ  *pso, CLIPOBJ  *pco, BRUSHOBJ  *pbo, LONG  x1, LONG  y1, LONG  x2, LONG  y2, RECTL  *prclBounds, MIX  mix)
{
    ENGDEBUGPRINT(0, "GdiExample_DrvLineTo\r\n", NULL);
    return EngLineTo(pso, pco, pbo, x1, y1, x2, y2, prclBounds, mix);
}

/*********************************************************************
 * GdiExample_DrvStrokePath
 *
 *    This API implements a stroke path operation.
 *
 *********************************************************************/
BOOL GdiExample_DrvStrokePath(SURFOBJ  *pso, PATHOBJ  *ppo, CLIPOBJ  *pco, XFORMOBJ  *pxo, BRUSHOBJ  *pbo, POINTL  *pptlBrushOrg, LINEATTRS  *plineattrs, MIX  mix)            
{
    ENGDEBUGPRINT(0, "GdiExample_DrvStrokePath\r\n", NULL);

    return EngStrokePath(pso, ppo, pco, pxo, pbo, pptlBrushOrg, plineattrs, mix);
}

/*********************************************************************
 * GdiExample_DrvTextOut
 *
 *    This API writes text on to a surface.
 *
 *********************************************************************/
BOOL GdiExample_DrvTextOut(SURFOBJ  *pso, STROBJ  *pstro, FONTOBJ  *pfo, CLIPOBJ  *pco, RECTL  *prclExtra, RECTL  *prclOpaque, BRUSHOBJ  *pboFore, BRUSHOBJ  *pboOpaque, POINTL  *pptlOrg, MIX  mix)
{
    ENGDEBUGPRINT(0, "GdiExample_DrvTextOut\r\n", NULL);

    return EngTextOut(pso, pstro, pfo, pco, prclExtra, prclOpaque, pboFore, pboOpaque, pptlOrg, mix);
}
               

/*********************************************************************
 * GdiExample_DrvTransparentBlt
 *
 *    This API performs a TransparentBlt.
 *
 *********************************************************************/
BOOL GdiExample_DrvTransparentBlt(SURFOBJ  *psoDst, SURFOBJ  *psoSrc, CLIPOBJ  *pco, XLATEOBJ  *pxlo, RECTL  *prclDst, RECTL  *prclSrc, ULONG  iTransColor, ULONG  ulReserved)
{
    ENGDEBUGPRINT(0, "GdiExample_DrvTransparentBlt\r\n", NULL);
    return EngTransparentBlt(psoDst, psoSrc, pco, pxlo, prclDst, prclSrc, iTransColor, ulReserved);
}


/*********************************************************************
 * GdiExample_DrvCreateDeviceBitmap
 *
 *    This API creates and manages bitmaps.  We return 0 to let GDI handle this.
 *
 *********************************************************************/

HBITMAP GdiExample_DrvCreateDeviceBitmap(DHPDEV  dhpdev, SIZEL  sizl, ULONG  iFormat) 
{
    ENGDEBUGPRINT(0, "GdiExample_DrvCreateDeviceBitmap\r\n", NULL);

    return NULL;
}

/*********************************************************************
 * GdiExample_DrvDeleteDeviceBitmap
 *
 *    This API deletes managed bitmaps.  We are not implementing this.
 *
 *********************************************************************/
void GdiExample_DrvDeleteDeviceBitmap(DHSURF  dhsurf)   
{
    ENGDEBUGPRINT(0, "GdiExample_DrvDeleteDeviceBitmap\r\n", NULL);

}


/*********************************************************************
 * GdiExample_DrvDestroyFont
 *
 *    This API is called to delete a FONT
 *
 *********************************************************************/
void GdiExample_DrvDestroyFont(FONTOBJ  *pfo)
{
    ENGDEBUGPRINT(0, "GdiExample_DrvDestroyFont\r\n", NULL);

}





