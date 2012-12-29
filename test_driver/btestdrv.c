#include <wdm.h>

void DriverUnload(PDRIVER_OBJECT pDriverObject)
{
	DbgPrint("BT driver unloading \n");
}


NTSTATUS DriverEntry(PDRIVER_OBJECT DriverObject, PUNICODE_STRING RegistryPath)
{
	DriverObject->DriverUnload = DriverUnload;
	DbgPrint("DriverEntry \n");
	return STATUS_SUCCESS;
}