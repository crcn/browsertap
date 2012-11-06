#ifndef SCREENS_CONTROLLERS_COLLECTION_H_
#define SCREENS_CONTROLLERS_COLLECTION_H_

#include "screens/screens.h"
#include <vector>

namespace Screens
{
	class ControllerCollection : public BaseScreenController
	{

	private:
		std::vector<BaseScreenController*> _controllers;


	public:

		/**
		 */

		ControllerCollection();

		/**
		 */

		void add(BaseScreenController* controller);

		/**
		 */

		void update();

		/**
		 */

		void screen(Screen* screen);

		/**
		 */

		std::vector<std::string> events();
	};
}

#endif