#ifndef SCREEN_GRAPHICS_H_
#define SCREEN_GRAPHICS_H_

#include "screens/recorder/recorder.h"
#include "common/graphics.h"

namespace Screens
{
	class Screen;

	/**
	 */

	class Graphics
	{
	public:
		Graphics(Screen* screen);
		Recorder* recorder();
	private:
		Screen* _screen;
	};
}

#endif