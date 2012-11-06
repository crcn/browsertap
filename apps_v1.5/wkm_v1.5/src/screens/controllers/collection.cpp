#include "screens/controllers/collection.h"

namespace Screens 
{
	ControllerCollection::ControllerCollection():
	BaseScreenController()
	{
	}

	void ControllerCollection::add(BaseScreenController* controller) 
	{
		this->_controllers.push_back(controller);
	}

	void ControllerCollection::update()
	{
		for(int i = this->_controllers.size(); i--;)
		{
			this->_controllers.at(i)->update();
		}

		BaseScreenController::update();
	}

	void ControllerCollection::screen(Screen* value)
	{
		for(int i = this->_controllers.size(); i--;)
		{
			this->_controllers.at(i)->screen(value);
		}

		BaseScreenController::screen(value);
	}

	std::vector<std::string> ControllerCollection::events()
	{
		return std::vector<std::string>();
	}
}