//#region Request Dto
export class GetOrgByIdRequestDto {
	identifier: string;
}
//#endregion

//#region Response Dto
export class GetOrgByIdResponseDto {
	identifier: string;
	orgName: string;
}
//#endregion
