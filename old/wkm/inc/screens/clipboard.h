#include <string>

namespace Screens 
{
	class Clipboard 
	{
	public:
		Clipboard();
		void setValue(std::string value);
		std::string getValue();
		bool hasChanged();
		static Clipboard& instance()
		{
			static Clipboard instance;
			return instance;
		}
	private: 
		std::string _currentData;
	};
}